export const checkans =(correctquestionid, questionid)=>{
    if (correctquestionid.has(questionid))
        return true
    
    else
        return false
    
}