from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player

def changeStand(request):
    data = request.GET
    standimg = data.get("standimg", "").strip()
    changename = data.get("changename", "").strip()
    result = 'success'

    if User.objects.filter(username=changename).exists():
        Player.objects.update(photo=standimg)

    return JsonResponse({
        'result': result,
        'standimg': standimg,
        'changename': changename,
    })

