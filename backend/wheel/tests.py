from django.test import TestCase
from django.urls import reverse


class WheelPageTests(TestCase):
    def test_home_page_loads(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)

    def test_random_wheel_page_loads(self):
        response = self.client.get(reverse('random_wheel'))
        self.assertEqual(response.status_code, 200)
