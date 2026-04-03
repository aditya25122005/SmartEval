import { useState } from "react";
import { apiFetch } from "../api/api";
import Navbar from "../components/Navbar";

function CreateQuestion() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    difficulty: "Medium",
    options: [
      { optionText: "", isCorrect: false },
      { optionText: "", isCorrect: false }
    ]
  });

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { optionText: "", isCorrect: false }]
    });
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/api/faculty/questions", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      alert("Question added to the Global Bank! ✅");
      setFormData({ title: "", description: "", subject: "", difficulty: "Medium", options: [{ optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }] });
    } catch (err) {
      alert("Error saving question: " + err.message);
    }
  };


  const handleSave = async () => {
  try {
    await apiFetch("/api/faculty/questions", {
      method: "POST",
      body: JSON.stringify(formData)
    });
    alert("Question Added! ✅");
    
    // Check if the parent passed a refresh function
    if (props.onSaveSuccess) {
      props.onSaveSuccess();
    }
  } catch (err) { 
    alert(err.message); 
  }
};

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Add to Question Bank</h2>
          
          <input type="text" placeholder="Question Title (e.g., Java Loops)" className="w-full border p-3 rounded mb-4" 
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          
          <textarea placeholder="Detailed Question Description..." className="w-full border p-3 rounded mb-4 h-32" 
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <input type="text" placeholder="Subject" className="border p-3 rounded" 
              value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
            <select className="border p-3 rounded" value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <h3 className="font-bold mb-3 border-b pb-2">Options (Check the correct one)</h3>
          {formData.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <input type="text" placeholder={`Option ${i+1}`} className="flex-1 border p-2 rounded" 
                value={opt.optionText} onChange={(e) => handleOptionChange(i, "optionText", e.target.value)} required />
              <input type="checkbox" checked={opt.isCorrect} onChange={(e) => handleOptionChange(i, "isCorrect", e.target.checked)} />
            </div>
          ))}

          <button type="button" onClick={handleAddOption} className="text-blue-600 font-semibold mb-6 hover:underline">+ Add Another Option</button>
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">Save to Bank</button>
        </form>
      </div>
    </>
  );
}

export default CreateQuestion;