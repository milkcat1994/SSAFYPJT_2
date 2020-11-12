from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Q
# Create your views here.
from .models import Compatibility, Store

from rest_framework import viewsets

class IndexViewSet(viewsets.ModelViewSet):
    def index(self):
        return HttpResponse("FOODMATE recommend")


class FoodViewSet(viewsets.ModelViewSet):

    def compatibility(self, food):
        # 음식 이름이 들어간 궁합 select
        queryset = Compatibility.objects.filter(Q(food_a__contains=food) | Q(food_b__contains=food)).values()
        # res = queryset_a.union(queryset_b, all=True)
        return HttpResponse(list(queryset))
    
    def comp_stores(self, food):
        # 추천 음식 이름이 들어간 궁합 set
        queryset_food = Compatibility.objects.filter(Q(food_a__contains=food) | Q(food_b__contains=food)).values()
        queryset_store = Store.objects.filter(
                Q(menu__contains=queryset_food[1].get('food_a')) & Q(menu__contains=queryset_food[1].get('food_b'))).values()
        # 궁합set이 메뉴에 있는 가게
        for queryset in queryset_food:
            queryset_store_sub = Store.objects.filter(
                Q(menu__contains=queryset.get('food_a')) & Q(menu__contains=queryset.get('food_b'))).values()
            queryset_store = queryset_store.union(queryset_store_sub, all=True)

        return HttpResponse(list(queryset_store))
