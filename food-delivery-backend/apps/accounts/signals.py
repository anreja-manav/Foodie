# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import Account, CustomerProfile, VendorProfile, DeliveryProfile

# @receiver(post_save, sender=Account)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         if instance.role == "customer":
#             CustomerProfile.objects.create(user=instance)
#         elif instance.role == "vendor":
#             VendorProfile.objects.create(user=instance)
#         elif instance.role == "delivery":
#             DeliveryProfile.objects.create(user=instance)