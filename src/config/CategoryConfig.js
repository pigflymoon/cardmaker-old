const cardsType = {
    holiday: ["christmas", "newYear", "easter"],
    birthday: ["kids", "forHer", "forHim"],
    thankyou: ["general", "birthday", "wedding"],
    occasions: ["anniversary", "goodLuck", "teacherAppreciation"],
    congratulations: ["graduation", "newBaby", "exam"],
    thoughtsFeelings: ["cheerUp", "friendship", "getWell","loveRomance"]
}

const invitationsType = {
    holiday: ["christmas", "newYear", "easter"],
    birthday: ["kids", "women", "men"],
    wedding: ["invitation", "saveTheDate", "rsvp"],
    party:["anniversary","graduationParty","BBQParty"],
    announcement:["birth","graduation"]
}

export default CategoryConfig = {
    cards: cardsType,
    invitations: invitationsType,
    showImagesNumber: 9,
    showLatestImagesNumber: 4,
    showFreeImagesNumber: 3
}