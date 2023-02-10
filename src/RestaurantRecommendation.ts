import CostTracking from "./CostTracking";
import CuisineTracking from "./CuisineTracking";
import Restaurant from "./Restaurant";
import User from "./User";
import * as utils from "./utils";



class RestaurantRecommendation {
    newRestaurantCount: number = 0;
    getRestaurantRecommendation(user: User, availableRestaurants: Restaurant[]): Restaurant[] {
        const { costBrackets, cuisines } = user;
        const [primaryCuisine, secondaryCuisineFirst, secondaryCuisineSecond] = utils.getCuisinesSortedByOrders(cuisines);
        const [primaryCostBracket, secondaryCostBracketFirst, secondaryCostBracketSecond] =
            utils.getCostBracketSortedByOrders(costBrackets);
        const uniqueAvailableRestaurants = utils.getUniqueRestaurants(availableRestaurants);
        const secondaryCuisines = utils.getSecondaryChoicesForCuisines(secondaryCuisineFirst, secondaryCuisineSecond);
        const secondaryCostBrackets = utils.getSecondaryChoicesForCostBrackets(
            secondaryCostBracketFirst, secondaryCostBracketSecond);
        const sortedRestaurants = this.getSortedRestaurants(
            uniqueAvailableRestaurants, primaryCuisine, secondaryCuisines, primaryCostBracket, secondaryCostBrackets);
        return sortedRestaurants;
    }

    getSortedRestaurants(uniqueAvailableRestaurants: Restaurant[], primaryCuisine: CuisineTracking,
        secondaryCuisines: CuisineTracking[], primaryCostBracket: CostTracking, secondaryCostBrackets: CostTracking[]) {
        this.newRestaurantCount = 0;
        let sortedRestaurants = uniqueAvailableRestaurants.sort((restaurant1: Restaurant, restaurant2: Restaurant) => {
            let primaryResult: number = 0;
            primaryResult = this.compareRestaurantOfPrimaryCuisineAndPrimaryCostBracket(restaurant1, restaurant2,
                primaryCuisine, primaryCostBracket);
            if (primaryResult) { return primaryResult; }
            primaryResult = this.compareRestaurantOfPrimaryCuisineAndSecondaryCostBracket(restaurant1, restaurant2,
                primaryCuisine, secondaryCostBrackets);
            if (primaryResult) { return primaryResult; }
            primaryResult = this.compareRestaurantOfSecondaryCuisineAndPrimaryCostBracket(restaurant1, restaurant2,
                secondaryCuisines, primaryCostBracket);
            if (primaryResult) { return primaryResult; }
            primaryResult = this.compareRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndFourStarsRating(restaurant1,
                restaurant2, primaryCuisine, primaryCostBracket);
            if (primaryResult) { return primaryResult; }
            primaryResult = this.compareNewlyOnboardedRestaurants(restaurant1, restaurant2);
            if (primaryResult) { return primaryResult; }
            primaryResult = this.compareRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndFourAndAHalfStarsRating(restaurant1,
                restaurant2, primaryCuisine, secondaryCostBrackets);
            if (primaryResult) { return primaryResult; }
            primaryResult = this.compareIsRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndFourAndAHalfStarsRating(restaurant1,
                restaurant2, secondaryCuisines, primaryCostBracket);
            if (primaryResult) { return primaryResult; }
            primaryResult = this.compareIsRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndBelowFourStarsRating(restaurant1,
                restaurant2, primaryCuisine, primaryCostBracket);
            if (primaryResult) { return primaryResult; }
            primaryResult = this.compareIsRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndBelowFourAndAHalfStarsRating(
                restaurant1, restaurant2, primaryCuisine, secondaryCostBrackets);
            if (primaryResult) { return primaryResult; }
            primaryResult = this.compareIsRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndBelowFourAndAHalfStarsRating(
                restaurant1, restaurant2, secondaryCuisines, primaryCostBracket)
            return 0;
        });
        this.newRestaurantCount = 0;
        return sortedRestaurants;
    }

    getIsRestaurantOfPrimaryCuisineAndPrimaryCostBracket(restaurant: Restaurant, primaryCuisine: CuisineTracking,
        primaryCostBracket: CostTracking) {
        const { cuisine: cuisineRestaurant, costBracket: costBracketRestaurant, isRecommended } = restaurant;
        const { cuisine } = primaryCuisine;
        const { costBracket } = primaryCostBracket;
        return cuisineRestaurant === cuisine && costBracketRestaurant === costBracket && isRecommended;
    }

    getIsRestaurantOfPrimaryCuisineAndSecondaryCostBracket(restaurant: Restaurant, primaryCuisine: CuisineTracking,
        secondaryCostBrackets: CostTracking[]) {
        const { cuisine: cuisineRestaurant, costBracket: costBracketRestaurant, isRecommended } = restaurant;
        const { cuisine } = primaryCuisine;
        const costBrackets = secondaryCostBrackets.map(costBracket => costBracket.costBracket);
        return cuisineRestaurant === cuisine && costBrackets.indexOf(costBracketRestaurant) > -1 && isRecommended;
    }

    getIsRestaurantOfSecondaryCuisineAndPrimaryCostBracket(restaurant: Restaurant, secondaryCuisines: CuisineTracking[],
        primaryCostBracket: CostTracking) {
        const { cuisine: cuisineRestaurant, costBracket: costBracketRestaurant, isRecommended } = restaurant;
        const cuisines = secondaryCuisines.map(cuisine => cuisine.cuisine);
        const { costBracket } = primaryCostBracket;
        return cuisines.indexOf(cuisineRestaurant) > -1 && costBracketRestaurant === costBracket && isRecommended;
    }

    getIsRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndFourStarsRating(restaurant: Restaurant, primaryCuisine: CuisineTracking,
        primaryCostBracket: CostTracking) {
        const { rating } = restaurant;
        return this.getIsRestaurantOfPrimaryCuisineAndPrimaryCostBracket(restaurant, primaryCuisine, primaryCostBracket) &&
            rating >= 4;

    }

    getIsRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndFourAndAHalfStarsRating(restaurant: Restaurant, primaryCuisine: CuisineTracking,
        secondaryCostBrackets: CostTracking[]) {
        const { rating } = restaurant;
        return this.getIsRestaurantOfPrimaryCuisineAndSecondaryCostBracket(restaurant, primaryCuisine, secondaryCostBrackets) &&
            rating >= 4.5;

    }

    getIsRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndFourAndAHalfStarsRating(restaurant: Restaurant, secondaryCuisines: CuisineTracking[],
        primaryCostBracket: CostTracking) {
        const { rating } = restaurant;
        return this.getIsRestaurantOfSecondaryCuisineAndPrimaryCostBracket(restaurant, secondaryCuisines, primaryCostBracket) &&
            rating >= 4.5;
    }

    getIsRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndBelowFourStarsRating(restaurant: Restaurant, primaryCuisine: CuisineTracking,
        primaryCostBracket: CostTracking) {
        const { rating } = restaurant;
        return this.getIsRestaurantOfPrimaryCuisineAndPrimaryCostBracket(restaurant, primaryCuisine, primaryCostBracket) &&
            rating < 4;

    }

    getIsRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndBelowFourAndAHalfStarsRating(restaurant: Restaurant, primaryCuisine: CuisineTracking,
        secondaryCostBrackets: CostTracking[]) {
        const { rating } = restaurant;
        return this.getIsRestaurantOfPrimaryCuisineAndSecondaryCostBracket(restaurant, primaryCuisine, secondaryCostBrackets) &&
            rating < 4.5;

    }

    getIsRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndBelowFourAndAHalfStarsRating(restaurant: Restaurant, secondaryCuisines: CuisineTracking[],
        primaryCostBracket: CostTracking) {
        const { rating } = restaurant;
        return this.getIsRestaurantOfSecondaryCuisineAndPrimaryCostBracket(restaurant, secondaryCuisines, primaryCostBracket) &&
            rating < 4.5;
    }

    getIsNewlyOnboardedRestaurant(restaurant: Restaurant) {
        const { onboardedTime } = restaurant;
        const milliseconds_in_two_days = 2 * 24 * 60 * 60 * 1000;
        return new Date(onboardedTime).getTime() + milliseconds_in_two_days > new Date().getTime();
    }

    compareRestaurantOfPrimaryCuisineAndPrimaryCostBracket(restaurant1: Restaurant, restaurant2: Restaurant, primaryCuisine: CuisineTracking,
        primaryCostBracket: CostTracking) {
        const isRestaurantOfPrimaryCuisineAndPrimaryCostBracketForFirst =
            this.getIsRestaurantOfPrimaryCuisineAndPrimaryCostBracket(restaurant1, primaryCuisine, primaryCostBracket);
        const isRestaurantOfPrimaryCuisineAndPrimaryCostBracketForSecond =
            this.getIsRestaurantOfPrimaryCuisineAndPrimaryCostBracket(restaurant2, primaryCuisine, primaryCostBracket);
        console.log(restaurant1.isRecommended, restaurant2.isRecommended);
        console.log(isRestaurantOfPrimaryCuisineAndPrimaryCostBracketForFirst,
            isRestaurantOfPrimaryCuisineAndPrimaryCostBracketForSecond);
        console.log(utils.getSortResultFromParams(isRestaurantOfPrimaryCuisineAndPrimaryCostBracketForFirst,
            isRestaurantOfPrimaryCuisineAndPrimaryCostBracketForSecond));

        return utils.getSortResultFromParams(isRestaurantOfPrimaryCuisineAndPrimaryCostBracketForFirst,
            isRestaurantOfPrimaryCuisineAndPrimaryCostBracketForSecond)
    }

    compareRestaurantOfPrimaryCuisineAndSecondaryCostBracket(restaurant1: Restaurant, restaurant2: Restaurant, primaryCuisine: CuisineTracking,
        secondaryCostBrackets: CostTracking[]) {
        const isRestaurantOfSecondaryCuisineAndPrimaryCostBracketForFirst =
            this.getIsRestaurantOfPrimaryCuisineAndSecondaryCostBracket(restaurant1, primaryCuisine, secondaryCostBrackets);
        const isRestaurantOfSecondaryCuisineAndPrimaryCostBracketForSecond =
            this.getIsRestaurantOfPrimaryCuisineAndSecondaryCostBracket(restaurant2, primaryCuisine, secondaryCostBrackets);
        return utils.getSortResultFromParams(isRestaurantOfSecondaryCuisineAndPrimaryCostBracketForFirst,
            isRestaurantOfSecondaryCuisineAndPrimaryCostBracketForSecond);
    }

    compareRestaurantOfSecondaryCuisineAndPrimaryCostBracket(restaurant1: Restaurant, restaurant2: Restaurant, secondaryCuisines: CuisineTracking[],
        primaryCostBracket: CostTracking) {
        const isRestaurantOfSecondaryCuisineAndPrimaryCostBracketForFirst =
            this.getIsRestaurantOfSecondaryCuisineAndPrimaryCostBracket(restaurant1, secondaryCuisines, primaryCostBracket);
        const isRestaurantOfSecondaryCuisineAndPrimaryCostBracketForSecond =
            this.getIsRestaurantOfSecondaryCuisineAndPrimaryCostBracket(restaurant2, secondaryCuisines, primaryCostBracket);
        return utils.getSortResultFromParams(isRestaurantOfSecondaryCuisineAndPrimaryCostBracketForFirst,
            isRestaurantOfSecondaryCuisineAndPrimaryCostBracketForSecond);
    }

    compareRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndFourStarsRating(restaurant1: Restaurant, restaurant2: Restaurant, primaryCuisine: CuisineTracking,
        primaryCostBracket: CostTracking) {
        const isRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndFourStarsRatingForFirst =
            this.getIsRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndFourStarsRating(restaurant1, primaryCuisine, primaryCostBracket);
        const isRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndFourStarsRatingForSecond =
            this.getIsRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndFourStarsRating(restaurant2, primaryCuisine, primaryCostBracket);
        return utils.getSortResultFromParams(isRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndFourStarsRatingForFirst,
            isRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndFourStarsRatingForSecond)
    }

    compareNewlyOnboardedRestaurants(restaurant1: Restaurant, restaurant2: Restaurant) {
        if (this.newRestaurantCount == 4) { return 0 }
        const isNewlyOnboardedRestaurantForFirst = this.getIsNewlyOnboardedRestaurant(restaurant1);
        const isNewlyOnboardedRestaurantForSecond = this.getIsNewlyOnboardedRestaurant(restaurant2);
        if (!isNewlyOnboardedRestaurantForFirst && !isNewlyOnboardedRestaurantForSecond) {
            return 0;
        }
        this.newRestaurantCount++;
        if (isNewlyOnboardedRestaurantForFirst && isNewlyOnboardedRestaurantForSecond) {
            return restaurant2.rating - restaurant1.rating;
        }
        return utils.getSortResultFromParams(isNewlyOnboardedRestaurantForFirst, isNewlyOnboardedRestaurantForSecond);

    }

    compareRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndFourAndAHalfStarsRating(restaurant1: Restaurant, restaurant2: Restaurant, primaryCuisine: CuisineTracking,
        secondaryCostBrackets: CostTracking[]) {
        const isRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndFourAndAHalfStarsRatingForFirst =
            this.getIsRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndFourAndAHalfStarsRating(restaurant1, primaryCuisine, secondaryCostBrackets);
        const isRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndFourAndAHalfStarsRatingForSecond =
            this.getIsRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndFourAndAHalfStarsRating(restaurant2, primaryCuisine, secondaryCostBrackets);
        return utils.getSortResultFromParams(isRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndFourAndAHalfStarsRatingForFirst,
            isRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndFourAndAHalfStarsRatingForSecond);
    }

    compareIsRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndFourAndAHalfStarsRating(restaurant1: Restaurant, restaurant2: Restaurant, secondaryCuisines: CuisineTracking[],
        primaryCostBracket: CostTracking) {
        const isRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndFourAndAHalfStarsRatingForFirst =
            this.getIsRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndFourAndAHalfStarsRating(restaurant1, secondaryCuisines, primaryCostBracket);
        const isRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndFourAndAHalfStarsRatingForSecond =
            this.getIsRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndFourAndAHalfStarsRating(restaurant2, secondaryCuisines, primaryCostBracket);
        return utils.getSortResultFromParams(isRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndFourAndAHalfStarsRatingForFirst,
            isRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndFourAndAHalfStarsRatingForSecond);
    }

    compareIsRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndBelowFourStarsRating(restaurant1: Restaurant, restaurant2: Restaurant, primaryCuisine: CuisineTracking,
        primaryCostBracket: CostTracking) {
        const isRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndBelowFourStarsRatingForFirst =
            this.getIsRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndBelowFourStarsRating(restaurant1, primaryCuisine, primaryCostBracket);
        const isRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndBelowFourStarsRatingForSecond =
            this.getIsRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndBelowFourStarsRating(restaurant2, primaryCuisine, primaryCostBracket);
        return utils.getSortResultFromParams(isRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndBelowFourStarsRatingForFirst,
            isRestaurantOfPrimaryCuisineAndPrimaryCostBracketAndBelowFourStarsRatingForSecond)
    }

    compareIsRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndBelowFourAndAHalfStarsRating(restaurant1: Restaurant, restaurant2: Restaurant, primaryCuisine: CuisineTracking,
        secondaryCostBrackets: CostTracking[]) {
        const isRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndBelowFourAndAHalfStarsRatingForFirst =
            this.getIsRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndBelowFourAndAHalfStarsRating(restaurant1, primaryCuisine, secondaryCostBrackets);
        const isRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndBelowFourAndAHalfStarsRatingForSecond =
            this.getIsRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndBelowFourAndAHalfStarsRating(restaurant2, primaryCuisine, secondaryCostBrackets);
        return utils.getSortResultFromParams(isRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndBelowFourAndAHalfStarsRatingForFirst,
            isRestaurantOfPrimaryCuisineAndSecondaryCostBracketAndBelowFourAndAHalfStarsRatingForSecond);

    }

    compareIsRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndBelowFourAndAHalfStarsRating(restaurant1: Restaurant, restaurant2: Restaurant, secondaryCuisines: CuisineTracking[],
        primaryCostBracket: CostTracking) {
        const isRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndBelowFourAndAHalfStarsRatingForFirst =
            this.getIsRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndBelowFourAndAHalfStarsRating(restaurant1, secondaryCuisines, primaryCostBracket);
        const isRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndBelowFourAndAHalfStarsRatingForSecond =
            this.getIsRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndBelowFourAndAHalfStarsRating(restaurant2, secondaryCuisines, primaryCostBracket);
        return utils.getSortResultFromParams(isRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndBelowFourAndAHalfStarsRatingForFirst,
            isRestaurantOfSecondaryCuisineAndPrimaryCostBracketAndBelowFourAndAHalfStarsRatingForSecond);
    }

}

export default RestaurantRecommendation;