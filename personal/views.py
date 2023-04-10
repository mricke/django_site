from django.shortcuts import render

def index(request):
    return render(request, "index.html")

def memory_game(request):
    return render(request, "memory_game.html")

def fruit_shop(request):
    return render(request, "fruit_shop.html")
