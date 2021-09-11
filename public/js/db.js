const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;


const request = indexedDB.open("budget", 1);
let idb;

function checkDatabase() {
  const transaction = db.transaction(["pending"], "readonly");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = () => {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        const transaction = db.transaction(["pending"], "readonly");
        const store = transaction.objectStore("pending");
        store.clear();
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
    }
  };
}


window.addEventListener("online", checkDatabase);