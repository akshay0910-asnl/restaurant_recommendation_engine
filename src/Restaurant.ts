import Cuisine from "./Cuisine";

class Restaurant {
    restaurantId: string;
    cuisine: Cuisine;
    costBracket: number;
    rating: number;
    isRecommended: boolean
    onboardedTime: Date;
    constructor(restaurantId: string, cuisine: Cuisine, costBracket: number, rating: number, isRecommended: boolean) {
        this.restaurantId = restaurantId;
        this.cuisine = cuisine;
        this.costBracket = costBracket;
        this.rating = rating;
        this.isRecommended = isRecommended;
        this.onboardedTime = new Date();
    }
}


export default Restaurant;