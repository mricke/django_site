from django.urls import path, include
from . import views
urlpatterns = [
    path('', views.index),
    path('memory-game/', views.memory_game, name = "memory_game_template"),
    path('fruit-shop/', views.fruit_shop, name = "fruit_shop_template"),
]
