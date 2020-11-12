from django.contrib import admin

from .models import Compatibility, Incompatibility, Store
# Register your models here.

admin.site.register(Compatibility)
admin.site.register(Incompatibility)
admin.site.register(Store)