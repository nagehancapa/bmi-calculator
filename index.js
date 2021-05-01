function formatOutput(userObject){
    return `
        **************
        BMI CALCULATOR
        **************

        age: ${userObject.age} years
        gender: ${userObject.gender}
        height: ${userObject.heightInM} m
        weight: ${userObject.weightInKg}kg
        do you exercise daily? ${userObject.dailyExercise}

        ****************
        FACING THE FACTS
        ****************

        Your BMI is ${userObject.BMI}

        A BMI under 18.5 is considered underweight
        A BMI above 25 is considered overweight

        Your ideal weight is ${userObject.idealWeightKg} kg
        With a normal lifestyle you burn ${userObject.dailyCalories} calories a day

        **********
        DIET PLAN
        **********

        If you want to reach your ideal weight of ${userObject.idealWeightKg} kg:

        Eat ${userObject.dietCalories} calories a day
        For ${userObject.dietWeeks} weeks`
}

function validateNumberOfInputs(argv) {
    if (argv.length !== 7) {
        console.log(`
        You gave ${argv.length - 2} argument(s) to the program

        Please provide 5 arguments for
        weight (kg)
        height (m)
        age (years)
        whether you exercise daily (yes or no)
        your gender (m or f)

        Example:
        $ node index.js 82 1.79 32 yes m
        `)
        process.exit()
    }
}

function validateWeightHeightAndAge(weight, height, age, argv){
    if (isNaN(weight) || isNaN(height) || isNaN(age)) {
        console.log(`
        Please make sure weight, height and age are numbers:
      
        weight (kg) example: 82 | your input: ${argv[2]}
        height (m) example 1.79 | your input: ${argv[3]}
        age (years) example 32  | your input: ${argv[4]} 
           
        Example:
        $ node index.js 82 1.79 32 yes m
        `);      
        process.exit();
    }

    if (age < 20) {
        console.log(`
        This BMI calculator is designed for people over 20
        `);
        process.exit();
    }

    if (weight < 30 || weight > 300) {
        console.log(`
        Please provide a number for weight in kilograms between 30 and 300
        `);
        process.exit();
    }
}

function validateDailyExercise(dailyExercise) {
    if (dailyExercise !== "yes" && dailyExercise !== "no") {
        console.log(`
        Please specify if you exercise daily with "yes" or "no"
        
        You entered: ${dailyExercise}
        `);
        process.exit();
    }
}

function validateGender(gender) {
    if (gender !== "m" && gender !== "f") {
        console.log(`
        Please specify if you exercise daily with "m" or "f"
        
        You entered: ${gender}
        `);
        process.exit();
    }
}

function calculateBMI(weight, height) {
    // BMI: weight (kg) / (height (m) x height (m))
    return weight / (height ** 2)
}

function calculateBMR(weight, height, age, gender) {
    // BMR: 10 x weight (kg) + 6.25 x height (cm) - 5 x age
    const heightInCm = height * 100
    return gender === "m" ? 
        10 * weight + 6.25 * heightInCm - 5 * age + 50 :
        10 * weight + 6.25 * heightInCm - 5 * age - 150
}

function idealWeight(height) {
    // Assumption: ideal BMI is 22.5
    // IdealWeight: 22.5 x height (m) x height (m)
    return 22.5 * height ** 2
}

function dailyCalories(BMR, exercise) {
    // Assumption: calories exercise yes: BMR * 1.6
    // Assumption: calories exercise no: BMR * 1.4
    return exercise === "yes" ? BMR * 1.6 : BMR * 1.4
}

function weightToLose(weight, idealWeight) {
    return weight - idealWeight
}

function dietCalories(weightToLose, dailyCalories) {
    return weightToLose < 0 ?
        dietCalories = dailyCalories + 500 :
        dailyCalories - 500
}

function dietWeeks(weightToLose) {
    return Math.abs(weightToLose / 0.5)
}

function main() {
    validateNumberOfInputs(process.argv)

    const weightInKg = parseInt(process.argv[2])
    const heightInM = parseFloat(process.argv[3])
    const age = parseInt(process.argv[4])
    const dailyExercise = process.argv[5].toLowerCase()
    const gender = process.argv[6].toLowerCase()

    validateWeightHeightAndAge(weightInKg, heightInM, age, process.argv)
    validateDailyExercise(dailyExercise)
    validateGender(gender)

    const BMI = calculateBMI(weightInKg, heightInM)
    const BMR = calculateBMR(weightInKg, heightInM, age, gender)
    const idealWeightKg = idealWeight(heightInM)
    const weightToLoseKg = weightToLose(weightInKg, idealWeightKg)
    const dailyCal = dailyCalories(BMR, dailyExercise)
    const dietCal = dietCalories(weightToLoseKg, dailyCal)
    const dietWeek = dietWeeks(weightToLoseKg)

    // console.log("WEIGHT: ", weightInKg)
    // console.log("HEIGHT: ", heightInM)
    // console.log("AGE: ", age)
    // console.log("DAILY EXERCISE: ", dailyExercise)
    // console.log("GENDER: ", gender)
    // console.log("BMI: ", BMI)
    // console.log("BMR: ", BMR)
    // console.log("Ideal weight: ", idealWeightKg)
    // console.log("Weight to lose: ", weightToLoseKg)
    // console.log("Calories you need to take to keep your weight: ", dailyCal)
    // console.log("Calories you need to take to reach your ideal weight: ", dietCal)
    // console.log(`You can reach your ideal weight in ${Math.round(dietWeek)} weeks`)

    const user = {
        weightInKg: weightInKg,
        heightInM: heightInM,
        age: age,
        dailyExercise: dailyExercise,
        gender: gender,
        BMI: BMI,
        idealWeightKg: idealWeightKg,
        dailyCalories: dailyCal,
        weightToLoseKg: weightToLoseKg,
        dietWeeks: dietWeek,
        dietCalories: dietCal,
    }
    
    const output = formatOutput(user)
    console.log(output)
}

main()

