const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

const yourBet = () => {
    return new Promise((resolve, reject) => {
        rl.question('', (bet) => {
            if (bet.match(/^\d/)) {
                resolve(parseInt(bet))
            } else {
                reject('Invalid input')
            }
        })
    })
}

const checkPlayMore = () => {
    return new Promise((resolve, reject) => {
        rl.question("Wanna play more (Yes/No)?\n", (answer) => {
            if (answer.toString().trim().toLowerCase() === 'yes') {
                resolve(1)
            } else if (answer.toString().trim().toLowerCase() === 'no') {
                resolve(0)
            }
        })
    })
}

const main = async () => {
    let yourChips = 0;
    let statusPlay = true;
    console.log("node start");
    do {
        console.log("Please put your bet");

        const bet = await yourBet();
        let user = [];
        let dealer = [];

        for (let i = 0; i < 2; i++) {
            const tempUser = await randomCard();
            user.push(tempUser);
            const tempDealer = await randomCard();
            dealer.push(tempDealer);
        }

        console.log(`You got ${user[0]["str"]}, ${user[1]["str"]}`);
        console.log(`The dealer got ${dealer[0]["str"]}, ${dealer[1]["str"]}`);

        const results = await checkWinner(user, dealer, bet);
        console.log(results.message);
        if (results.betStatus == 3) {
            yourChips -= bet
        }
        if (results.betStatus == 1) {
            const answerPlayMore = await checkPlayMore()
            yourChips += bet
            if (!answerPlayMore) {
                console.log(`You got total ${yourChips} chips`)
                statusPlay = false;
                rl.close()
            }
        }

    } while (statusPlay);
}

const checkWinner = (player, banker, bet) => {
    return new Promise((resolve, rejcet) => {
        try {
            const user = (player[0]["value"] + player[1]["value"]) % 10;
            const dealer = (banker[0]["value"] + banker[1]["value"]) % 10;
            if (user > dealer) {
                resolve({
                    message: `You won!!!, received ${bet} chips`,
                    betStatus: 1
                });
            } else if (user == dealer) {
                resolve({
                    message: `equal`,
                    betStatus: 2,
                });
            } else {
                resolve({
                    message: `You lost!!!`,
                    betStatus: 3
                });
            }
        } catch (error) {
            rejcet(error);
        }
    });
};

const randomCard = () => {
    return new Promise((resolve, reject) => {
        const number = Math.floor(Math.random() * 13 + 1);
        const symbol = Math.floor(Math.random() * 4 + 1);

        const symbolInit = ['Clubs-',"Diamond-", "Hearts-", "Spade-"]

        let strCardObj = {
            str: "",
            letter: 0,
            value: 0,
        };

        // const testsym = symbolInit[symbol-1]
        strCardObj.str = symbolInit[symbol-1]
        if ([1, 11, 12, 13].indexOf(number) >= 0) {
            strCardObj.value = 0;
            switch (number) {
                case 1:
                    strCardObj.str += "One";
                    break;
                case 11:
                    strCardObj.str += "Jack";
                    break;
                case 12:
                    strCardObj.str += "Queen";
                    break;
                case 13:
                    strCardObj.str += "King";
                    break;

                default:
                    break;
            }
        } else {
            strCardObj.str += number;
            strCardObj.value = number;
        }
        resolve(strCardObj);
        // return strCardObj;
    });
};

main()