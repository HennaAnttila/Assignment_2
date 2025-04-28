// Quotefetcher component
function QuoteFetcher() {
  const [quote, setQuote] = React.useState("Loading...");
  const [author, setAuthor] = React.useState("");

  const fetchQuote = () => {
    fetch("https://api.allorigins.win/get?url=https://zenquotes.io/api/random")
      .then((res) => res.json())
      .then((data) => {
        const parsed = JSON.parse(data.contents);
        setQuote(parsed[0].q);
        setAuthor(parsed[0].a);
      })
      .catch((error) => {
        console.error("Error fetching quote:", error);
        setQuote("Failed to load quote.");
        setAuthor("");
      });
  };

  React.useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <section className="quote-section">
      <h2>Daily Motivation</h2>
      <p>"{quote}"</p>
      {author && <p><em>- {author}</em></p>}
    </section>
  );
}

// thoughtdump component
function ThoughtDump() {
  const [text, setText] = React.useState("");
  const [notes, setNotes] = React.useState(() => {
    return JSON.parse(localStorage.getItem("thoughtDumpNotes")) || [];
  });

  const handleSave = () => {
    if (text.trim() === "") return;
    const newNotes = [...notes, text];
    setNotes(newNotes);
    localStorage.setItem("thoughtDumpNotes", JSON.stringify(newNotes));
    setText("");
  };

  const handleDelete = (indexToRemove) => {
    const updatedNotes = notes.filter((_, i) => i !== indexToRemove);
    setNotes(updatedNotes);
    localStorage.setItem("thoughtDumpNotes", JSON.stringify(updatedNotes));
  };

  return (
    <section className="thought-dump">
      <h2>Thought Dump</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write anything that's on your mind..."
        rows="5"
        className="thought-textarea"
      ></textarea>
      <br />
      <button onClick={handleSave} className="save-thought-button">Save</button>

      <ul className="thought-list">
  {notes.map((note, index) => (
    <li key={index} className="thought-note">
    <span>{note}</span>
    <div className="button-container">
      <button onClick={() => handleDelete(index)}>Delete</button>
    </div>
  </li>
  
  ))}
</ul>

    </section>
  );
}

//render both components
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <QuoteFetcher />
    <ThoughtDump />
  </>
);

