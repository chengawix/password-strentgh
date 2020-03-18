
const MINMAL_LENGTH = 6;

const checks = [
    (password = "") => !/[a-z]/.test(password) ? "Add a lowercase letter" : undefined, // password has no lowercase letters
    (password = "") => !/[A-Z]/.test(password) ? "Add an upercase letter" : undefined,  // password has no uppercase letters
    (password = "") => !/[0-9]/.test(password) ? "Add a number" : undefined, // password has no numbers
    (password = "") => !/[^A-Za-z0-9]/.test(password) ? "Add a spcial character" : undefined // require at least one special character
]

const lengthToLengthScore = (length) => {
    length = Math.max(length, MINMAL_LENGTH) || MINMAL_LENGTH;
    const hints = [];
    if (length < 15) hints.push("Longer passwords are better")
    const lengthScore = (length === 6) ? -4 : // 6
            (length <   9) ? -2 : // 7, 8
            (length <  11) ?  0 : // 9, 10
            (length <  14) ?  2 : // 11,12,13
            (length <  16) ?  3 : // 14,15
            5 //16 +
    return {
        lengthScore,
        hints
    }
}

const passwordToLengthScore = (password) => lengthToLengthScore(password.length)


const passwordToComplexityScoreScore = (password) => {
    const hints = checks.map(test=>test(password)).filter(a=>a);
    return {
        complexityScore: checks.length - hints.length,
        hints
    }
}

const passwordToRepetitivityScore = (password) => {
    const hints = [];
    const repeatingCharExpression = /(.)\1{2,}/g;
    let repeatingCharsCount = 0;
    var repeatingChars = repeatingCharExpression.exec(password);
    
    while (repeatingChars) {
        let [match] = repeatingChars;
        repeatingCharsCount = Math.max(match.length, repeatingCharsCount);
        repeatingChars = repeatingCharExpression.exec(password);
    }
    let isRepetitive = ((repeatingCharsCount / password.length) > 0.5);
    if (isRepetitive) hints.push("Repeating chars is not recommended");

    const {lengthScore} = passwordToLengthScore(passwordToLengthScore)

    const repetitivityScore = (isRepetitive && lengthScore < 3) ? -1 : 0;

    return {
        repetitivityScore,
        isRepetitive,
        hints
    }

}

const scoreToLabel = (score) =>{
    score = Math.max(score, 0);
    switch (score) {
        case 0:
        case 1:
            return "Weak"
        case 2:    
            return "Okay"
        case 3:
        case 4:
            return "Good"
        case 5:
            return "Strong"
        default:
            return "Great"
            
    }
}

const classifyPassword = (password) => {
    if (password.length < MINMAL_LENGTH) throw new Error("Too short!");
    
    const {
        lengthScore,
        hints:lengthHints
    } = passwordToLengthScore(password);
    
    const {
        complexityScore, 
        hints:complexityHints
    } = passwordToComplexityScoreScore(password);
    
    const {
        isRepetitive,
        repetitivityScore, 
        hints:repetitivityHints
    } = passwordToRepetitivityScore(password);
    
    const finalScore = complexityScore + lengthScore + repetitivityScore;

    return {
        isRepetitive,
        repetitivityScore,
        finalScore,
        classification: scoreToLabel(finalScore),
        complexityScore,
        lengthScore,
        hints: lengthHints.concat(complexityHints).concat(repetitivityHints)
    }
}

module.exports = {
    classifyPassword,
    lengthToLengthScore,
    scoreToLabel,
}