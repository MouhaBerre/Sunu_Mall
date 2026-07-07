from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Role, Permission, UserRole, RolePermission, Session, Token


# Custom Admin Site Branding
admin.site.site_header = "SUNU MALL Administration"
admin.site.site_title = "SUNU MALL Admin"
admin.site.index_title = "Bienvenue sur le dashboard SUNU MALL"


class UserRoleInline(admin.TabularInline):
    model = UserRole
    extra = 1
    autocomplete_fields = ('role',)


class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'is_verified', 'created_at', 'get_roles')
    list_filter = ('is_active', 'is_verified', 'created_at', 'user_roles__role')
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    ordering = ('-created_at',)
    inlines = [UserRoleInline]
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations supplémentaires', {'fields': ('phone', 'is_verified')}),
    )
    
    def get_roles(self, obj):
        return ", ".join([ur.role.name for ur in obj.user_roles.all()])
    get_roles.short_description = "Rôles"


class RolePermissionInline(admin.TabularInline):
    model = RolePermission
    extra = 1
    autocomplete_fields = ('permission',)


class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')
    inlines = [RolePermissionInline]


class PermissionAdmin(admin.ModelAdmin):
    list_display = ('code', 'label', 'created_at')
    search_fields = ('code', 'label')


admin.site.register(User, UserAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(Permission, PermissionAdmin)
admin.site.register(UserRole)
admin.site.register(RolePermission)
admin.site.register(Session)
admin.site.register(Token)
