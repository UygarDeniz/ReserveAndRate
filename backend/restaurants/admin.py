from django.core.mail import send_mail
from django.conf import settings
from django.contrib import admin
from .models import Restaurant, Review, Cuisine, City, Invitation

admin.site.register(Restaurant)
admin.site.register(Review)
admin.site.register(Cuisine)
admin.site.register(City)

@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ('email', 'token', 'created_at', 'used_at')
    readonly_fields = ('token', 'created_at', 'used_at')
    
    def save_model(self, request, obj, form, change):
        if not change:
            super().save_model(request, obj, form, change)
            invite_link = f"{settings.FRONTEND_URL}/register/{obj.token}"
            send_mail(
                subject="Invitation to join ReserveNRate",
                message=f"You have been invited! Complete registration: {invite_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[obj.email],
                fail_silently=False,
            )
        else:
            super().save_model(request, obj, form, change)
