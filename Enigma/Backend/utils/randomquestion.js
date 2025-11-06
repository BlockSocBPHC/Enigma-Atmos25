import { UserData } from '../mongoose.js';
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const after = Number(process.env.attack_after_which_question);
const before = Number(process.env.attack_before_which_question);
const total = Number(process.env.Total_Questions);

const { default: questions } = await import('../ques.json', { with: { type: 'json' } });

export default async function addRandomQuestion(id) {
    if (!id) return;

    const data = await UserData.findById(id);
    if (!data) return;

    // assign a random attack time between "after" and "before"
    let attacktime
    if (!data.attackAfterWhichQuestion) {

        attacktime = after + Math.floor(Math.random() * (before - after));
        data.attackAfterWhichQuestion = attacktime;
        console.log('attacktime set:', attacktime);
        await data.save();
    }

    const actualAttackTime = data.attackAfterWhichQuestion

    // ATTACK LOGIC
    if (data.questions.length === actualAttackTime) {
        if (data.questions.every(q => q.status === 'success') && !data.attack1Done) {
            console.log('ghus gaya count me')
            let SelectedAttackQuestion;
            let randomIndex;

            const randomOffset = Math.floor(Math.random() * (before - after));
            let attackIndex = data.questions.length - randomOffset - 1;

            do {
                randomIndex = Math.floor(Math.random() * total);
                SelectedAttackQuestion = questions[randomIndex];
            } while (data.questions.some(q => q.id === SelectedAttackQuestion.id));

            data.questions[attackIndex] = { ...SelectedAttackQuestion, status: 'pending' };


            for (let i = attackIndex; i < data.questions.length; i++) {
                data.questions[i].status = 'pending';
            }
            data.attack1Done=true
            data.markModified('attack1Done')
            data.markModified('questions');
            const updated = await data.save();
            const question = updated.questions
            return ({ question, attackIndex });
        }
        const allSuccess = data.questions.every(q => q.status === 'success');
        if (!allSuccess) {
            console.log('running')
            return ({question: data.questions})
        }

    }

    // NORMAL QUESTION LOGIC
    let randomIndex, selectedQuestion;
    do {
        randomIndex = Math.floor(Math.random() * total);
        selectedQuestion = questions[randomIndex];
    } while (data.questions.some(q => q.id === selectedQuestion.id));

    data.questions.push({ ...selectedQuestion, status: 'pending' });
    data.markModified('questions');

    const updated = await data.save();
    const question = updated.questions
    let attackIndex = null
    return ({ question, attackIndex });
}

