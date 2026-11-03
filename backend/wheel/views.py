import random

from django.http import JsonResponse
from django.shortcuts import render


COLOURS = (
    ('Red', '#e74c3c'),
    ('Orange', '#f39c12'),
    ('Yellow', '#f1c40f'),
    ('Green', '#2ecc71'),
    ('Teal', '#1abc9c'),
    ('Cyan', '#35bde6'),
    ('Blue', '#3498db'),
    ('Navy', '#34495e'),
    ('Purple', '#9b59b6'),
    ('Pink', '#e84393'),
    ('Brown', '#9a6b45'),
    ('Grey', '#95a5a6'),
)


def home(request):
    return render(request, 'wheel/home.html')


def random_wheel(request):
    return render(request, 'wheel/random_wheel.html')


def random_colour(request):
    return render(request, 'wheel/random_colour.html')


def random_anything(request):
    return render(request, 'wheel/random_anything.html')


def random_colour_result(request):
    name, hex_value = random.choice(COLOURS)
    return JsonResponse({'name': name, 'hex': hex_value})


def random_number(request):
    try:
        min_val = int(request.GET.get('min', 1))
        max_val = int(request.GET.get('max', 200))
    except (TypeError, ValueError):
        return JsonResponse({'error': 'Min and max must be whole numbers.'}, status=400)

    if min_val < 1 or min_val > 200:
        return JsonResponse({'error': 'Min value must be between 1 and 200.'}, status=400)
    if max_val > 200:
        return JsonResponse({'error': 'Max value must not exceed 200.'}, status=400)
    if max_val < 1:
        return JsonResponse({'error': 'Max value must be at least 1.'}, status=400)
    if min_val > max_val:
        return JsonResponse({'error': 'Min value cannot be greater than max value.'}, status=400)

    number = random.randint(min_val, max_val)
    return JsonResponse({'number': number})
