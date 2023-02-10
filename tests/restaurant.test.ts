import Restaurant from '../src/Restaurant';
import Cuisine from '../src/Cuisine';
import User from '../src/User';
import CuisineTracking from '../src/CuisineTracking';
import CostTracking from '../src/CostTracking';
import RestaurantRecommendation from '../src/RestaurantRecommendation';

const cuisinesTrackingList = [
    new CuisineTracking(Cuisine.Chinese, 4),
    new CuisineTracking(Cuisine.Continental, 10),
    new CuisineTracking(Cuisine.NorthIndian, 15),
    new CuisineTracking(Cuisine.SouthIndian, 13),
]

const costTrackingList = [
    new CostTracking(1, 10),
    new CostTracking(2, 6),
    new CostTracking(3, 5),
    new CostTracking(4, 12),
    new CostTracking(5, 9),
]

const user = new User(cuisinesTrackingList, costTrackingList);
const restaurants = [new Restaurant("1", Cuisine.NorthIndian, 4, 4, false), new Restaurant("2", Cuisine.NorthIndian, 4, 4.8, true)];

const sortedRestaurants = new RestaurantRecommendation().getRestaurantRecommendation(user,restaurants);
console.log(sortedRestaurants);
