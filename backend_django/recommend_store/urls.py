from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path('', views.IndexViewSet.index),
    # 궁합 음식
    path('comp/<food>', views.FoodViewSet.compatibility),
    # 궁합 판매 음식점
    path('comp/store/<food>', views.FoodViewSet.comp_stores),
]
