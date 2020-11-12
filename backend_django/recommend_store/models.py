from django.db import models

# Create your models here.

class Compatibility(models.Model):
    objects = models.Manager()
    id = models.IntegerField(db_column='ID', primary_key=True)
    food_a = models.CharField(db_column='FOOD_A', max_length=45)  # Field name made lowercase.
    food_b = models.CharField(db_column='FOOD_B', max_length=45)  # Field name made lowercase.
    description = models.CharField(db_column='DESCRIPTION', max_length=100, blank=True, null=True)  # Field name made lowercase.
    search_cnt = models.IntegerField(db_column='SEARCH_CNT')  # Field name made lowercase.
    avg_star = models.FloatField(db_column='AVG_STAR')  # Field name made lowercase.
    review_cnt = models.IntegerField(db_column='REVIEW_CNT')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'COMPATIBILITY'


class Incompatibility(models.Model):
    objects = models.Manager()
    id = models.AutoField(db_column='ID', primary_key=True)
    food_a = models.CharField(db_column='FOOD_A', max_length=45)  # Field name made lowercase.
    food_b = models.CharField(db_column='FOOD_B', max_length=45)  # Field name made lowercase.
    description = models.CharField(db_column='DESCRIPTION', max_length=100, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'INCOMPATIBILITY'

class Store(models.Model):
    objects = models.Manager()
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='NAME', max_length=45, blank=True, null=True)  # Field name made lowercase.
    area = models.CharField(db_column='AREA', max_length=45, blank=True, null=True)  # Field name made lowercase.
    tel = models.CharField(db_column='TEL', max_length=45, blank=True, null=True)  # Field name made lowercase.
    address = models.CharField(db_column='ADDRESS', max_length=150, blank=True, null=True)  # Field name made lowercase.
    latitude = models.CharField(db_column='LATITUDE', max_length=45, blank=True, null=True)  # Field name made lowercase.
    longitude = models.CharField(db_column='LONGITUDE', max_length=45, blank=True, null=True)  # Field name made lowercase.
    category = models.CharField(db_column='CATEGORY', max_length=100, blank=True, null=True)  # Field name made lowercase.
    menu = models.CharField(db_column='MENU', max_length=300, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'STORE'


