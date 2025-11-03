// getData.js
export const getData = async (usedIds, setQuestions, setUsedIds) => {
  try {
    const res = await fetch("http://localhost:4000/getquestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Array.from(usedIds || [])),
    });

    const data = await res.json();

    if (!usedIds.has(data.id)) {
      setQuestions((prev) => [...prev, data]);
      setUsedIds((prev) => {
        const updated = new Set(prev);
        updated.add(data.id);
        return updated;
      });
      return data;                // ✅ return the new question
    } else {
      console.log(`⚠️ Duplicate question ${data.id} skipped`);
      return null;
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
};
 