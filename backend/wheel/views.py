import random

from django.http import JsonResponse
from django.shortcuts import render


def home(request):
    return render(request, 'wheel/home.html')


def random_wheel(request):
    return render(request, 'wheel/random_wheel.html')


def random_number(request):
    min_val = int(request.GET.get('min', 7))
    max_val = int(request.GET.get('max', 50))

    if min_val < 1:
        return JsonResponse({'error': 'Min value must be at least 1.'}, status=400)
    if max_val > 200:
        return JsonResponse({'error': 'Max value must not exceed 200.'}, status=400)
    if min_val > max_val:
        return JsonResponse({'error': 'Min value cannot be greater than max value.'}, status=400)

    number = random.randint(min_val, max_val)
    return JsonResponse({'number': number})