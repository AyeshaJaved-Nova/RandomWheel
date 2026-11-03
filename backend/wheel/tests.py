from django.test import TestCase
from django.urls import reverse


class WheelPageTests(TestCase):
    def assert_game_navigation(self, response):
        for route_name in ('random_wheel', 'random_colour', 'random_anything', 'home'):
            self.assertContains(response, reverse(route_name))

    def test_home_page_loads(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'class="background-flower"')
        self.assertNotContains(response, '>7</span>')
        self.assertContains(response, reverse('random_wheel'))
        self.assertContains(response, reverse('random_colour'))

    def test_random_wheel_page_loads(self):
        response = self.client.get(reverse('random_wheel'))
        self.assertEqual(response.status_code, 200)
        self.assert_game_navigation(response)
        self.assertContains(response, 'decoration-number')
        self.assertContains(response, 'decoration-wheel')
        self.assertNotContains(response, 'decoration-flower')

    def test_random_colour_page_loads(self):
        response = self.client.get(reverse('random_colour'))
        self.assertEqual(response.status_code, 200)
        self.assert_game_navigation(response)
        self.assertContains(response, 'decoration-dot')
        self.assertContains(response, 'decoration-wheel')
        self.assertNotContains(response, 'decoration-flower')
        self.assertNotContains(response, 'decoration-number')
        self.assertContains(response, 'color-palette')
        self.assertContains(response, 'type="color"')

    def test_random_colour_returns_a_colour(self):
        response = self.client.get(reverse('random_colour_result'))
        self.assertEqual(response.status_code, 200)
        self.assertIn(response.json()['name'], {
            'Red', 'Orange', 'Yellow', 'Green', 'Teal', 'Cyan',
            'Blue', 'Navy', 'Purple', 'Pink', 'Brown', 'Grey',
        })
        self.assertRegex(response.json()['hex'], r'^#[0-9a-fA-F]{6}$')

    def test_random_anything_page_loads_with_an_empty_wheel(self):
        response = self.client.get(reverse('random_anything'))
        self.assertEqual(response.status_code, 200)
        self.assert_game_navigation(response)
        self.assertContains(response, 'Fill your wheel with your choices.')
        self.assertContains(response, 'decoration-item')
        self.assertContains(response, 'decoration-wheel')
        self.assertNotContains(response, 'decoration-number')
        self.assertContains(response, 'id="wheelChoices"')
        self.assertNotContains(response, 'id="choiceList"')
        self.assertContains(response, 'anythingSpinBtn')
