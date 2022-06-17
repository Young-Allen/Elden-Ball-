from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache

class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        print('disconnect')
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def create_player(self, data):
        self.room_name = None

        for i in range(1000):
            name = "room-%d" % (i)
            if not cache.has_key(name) or (len(cache.get(name)) < settings.ROOM_CAPACITY):
                self.room_name = name
                break

        if not self.room_name:
            return 
        
        if not cache.has_key(self.room_name):
            cache.set(self.room_name, [], 180) # 有效期3分钟

        for player in cache.get(self.room_name):     # 对该房间已存在的用户，创建到新加入的用户的游戏界面中
            await self.send(text_data = json.dumps({
                'event': "create_player",
                'uuid': player['uuid'],
                'username': player['username'],
                'photo': player['photo'],
            }))
        print(self.room_name)
        # self.room_name = "room"
        await self.channel_layer.group_add(self.room_name, self.channel_name)

        players = cache.get(self.room_name)
        players.append({
            'uuid': data['uuid'],
            'username': data['username'],
            'photo': data['photo']
        })
        cache.set(self.room_name, players, 180) # 有效期3分钟
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",  # 群发该消息后，作为客户端接受者，所接受用的函数名
                'event': "create_player",
                'uuid': data['uuid'],
                'username': data['username'],
                'photo': data['photo'],
            }
        )

    # 和上面type的函数名是一致的
    async def group_send_event(self, data):
        await self.send(text_data=json.dumps(data))

    async def move_to(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",  # 群发该消息后，作为客户端接受者，所接受用的函数名
                'event': "move_to",
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
            }
        )

    async def shoot_fireball(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "shoot_fireball",
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
                'ball_uuid': data['ball_uuid'],
            }
        )

    async def attack(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'group_send_event',
                'event': "attack",
                'uuid': data['uuid'],
                'attackee_uuid': data['attackee_uuid'],
                'x': data['x'],
                'y': data['y'],
                'angle': data['angle'],
                'damage': data['damage'],
                'ball_uuid': data['ball_uuid'],
                'cur_skill': data['cur_skill'],
            }
        )

    async def blink(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "blink",
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
            }
        )


    async def message(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "message",
                'uuid': data['uuid'],
                'username': data['username'],
                'text': data['text'],
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        if event == 'create_player':
            await self.create_player(data)
        elif event == 'move_to':
            await self.move_to(data)
        elif event == 'shoot_fireball':
            await self.shoot_fireball(data)
        elif event == 'attack':
            await self.attack(data)
        elif event == 'blink':
            await self.blink(data)
        elif event == 'message':
            await self.message(data)