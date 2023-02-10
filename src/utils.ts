import CostTracking from "./CostTracking";
import CuisineTracking from "./CuisineTracking";
import Restaurant from "./Restaurant";

export const getUniqueRestaurants = (restaurants: Restaurant[]): Restaurant[] =>
(Object.values(restaurants.reduce((acc: Record<string, Restaurant>, restaurant: Restaurant) =>
    ({ ...acc, [restaurant.restaurantId]: restaurant }), {})));

export const getSecondaryChoicesForCuisines = (secondaryCuisineFirst: CuisineTracking, secondaryCuisineSecond: CuisineTracking): CuisineTracking[] =>
((secondaryCuisineFirst && secondaryCuisineSecond) ? [secondaryCuisineFirst, secondaryCuisineSecond] :
    secondaryCuisineFirst ? [secondaryCuisineFirst] :
        secondaryCuisineSecond ? [secondaryCuisineSecond] :
            []);

export const getSecondaryChoicesForCostBrackets = (secondaryCostBracketFirst: CostTracking, secondaryCostBracketSecond: CostTracking): CostTracking[] =>
((secondaryCostBracketFirst && secondaryCostBracketSecond) ? [secondaryCostBracketFirst, secondaryCostBracketSecond] :
    secondaryCostBracketFirst ? [secondaryCostBracketFirst] :
        secondaryCostBracketSecond ? [secondaryCostBracketSecond] :
            []);

export const getCuisinesSortedByOrders = (cuisines: CuisineTracking[]): CuisineTracking[] =>
(cuisines.sort((cuisine1: CuisineTracking, cuisine2: CuisineTracking) =>
    (cuisine2.noOfOrders - cuisine1.noOfOrders)));

export const getCostBracketSortedByOrders = (costBrackets: CostTracking[]): CostTracking[] =>
(costBrackets.sort((costBrackets1: CostTracking, costBrackets2: CostTracking) =>
    (costBrackets2.noOfOrders - costBrackets1.noOfOrders)));

export const getSortResultFromParams = (param1: boolean,param2: boolean)  => {
    return (param1 === param2)? 0 : (param1? -1 : 1);
}     






