const {scoreToLabel, lengthToLengthScore} = require("./password-strentgh");

const complexityCheckName = [
    "lowercase",
    "upercase",
    "number",
    "spcial",
]



const allComplexitiesCombos = {};

const buildCombos = (combo, checks)=> {
    if (!checks.length) {
        allComplexitiesCombos[combo.length] = allComplexitiesCombos[combo.length] || new Set();
        allComplexitiesCombos[combo.length].add(combo.sort().join(", "));
        return
    }
    checks.forEach(check=>{
        let _checks = new Set(checks);
        _checks.delete(check);
        if (combo.length) {
            allComplexitiesCombos[combo.length] = allComplexitiesCombos[combo.length] || new Set();
            allComplexitiesCombos[combo.length].add(combo.sort().join(", "));
        }
        buildCombos(combo.concat(check), Array.from(_checks))
    })
}

buildCombos([], complexityCheckName)

const passwordsLengthsScores = {
    "6":  lengthToLengthScore( 6).lengthScore,
    "7":  lengthToLengthScore( 8).lengthScore, //covers 7,8
    "9":  lengthToLengthScore( 9).lengthScore, //covers 9,10
    "11": lengthToLengthScore(11).lengthScore, //covers 11, 12, 13
    "14": lengthToLengthScore(14).lengthScore, //covers 14,15
    "16": lengthToLengthScore(16).lengthScore, //covers 16+
}



let results = {

}

const addResults = ({
    passwordsLengthsName,
    isRepetitive,
    finalScore,
    classification,
    complexityScore,
    lengthScore,
    combos
}) => {
    results[([
        classification,
        passwordsLengthsName,
        complexityScore,
        isRepetitive,
        
        lengthScore,
        finalScore
    ]).join("\t")] = combos;
}

console.log(allComplexitiesCombos)

Object.keys(passwordsLengthsScores).forEach(passwordsLengthsName=>{
    Object.keys(allComplexitiesCombos).forEach(key=>{
        const combos = Array.from(allComplexitiesCombos[key]);
        const complexityScore = parseInt(key);
        const lengthScore = passwordsLengthsScores[passwordsLengthsName];
        var repetitivityScore = 0;
        var isRepetitive = false;
        var finalScore = repetitivityScore + complexityScore + lengthScore;
       
        addResults({
            passwordsLengthsName,
            isRepetitive,
            repetitivityScore,
            finalScore,
            classification: scoreToLabel(finalScore),
            complexityScore,
            lengthScore,
            combos
        })

        isRepetitive = true;
        repetitivityScore = (isRepetitive && lengthScore < 3) ? -1 : 0; //mock
        finalScore = repetitivityScore + complexityScore + lengthScore; //mock
        
        addResults({
            passwordsLengthsName,
            isRepetitive,
            repetitivityScore,
            finalScore,
            classification: scoreToLabel(finalScore),
            complexityScore,
            lengthScore,
            combos
        })
    })
})

console.log(
    [
        "classification",
        "password lengths",
        "complexity score",
        "is repetitive",
        
        "length score",
        "final score",
        "Possible combos"
    ].join("\t")
)
Object.keys(results).forEach(key=>console.log(`${key}\t${results[key].join (" | ")}`))