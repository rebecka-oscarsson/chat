function createUserObject (enteredName, userId) {
    const userColor = 'hsl(' + randomVal(0, 360) + ', ' + randomVal(60, 80) + '%,  ' + randomVal(70, 90) + '%)';
    //hue mellan 0-360, saturation 0-100, lightness 0-100
    userObject = {userName: enteredName, userColor: userColor, userId: userId}
    return userObject
}

function randomVal(min, max) { //ger slumpsiffror till färggenerering
    return Math.floor(Math.random() * (max - min) + 1) + min;
}

module.exports = createUserObject