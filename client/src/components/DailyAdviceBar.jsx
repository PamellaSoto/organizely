import { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";

const DailyAdvice = () => {
  const APIURL = "https://api.adviceslip.com/advice";

  const [advice, setAdvice] = useState("");
  const [displayed, setDisplayed] = useState(false);

  const fetchAdvice = async () => {
    try {
      const response = await fetch(APIURL);
      const data = await response.json();
      setAdvice(data.slip.advice);
      setTimeout(() => { setDisplayed(true); }, 3000);
      setTimeout(() => { setDisplayed(false); }, 15000);
    } catch (error) {
      console.error("Error fetching advice:", error);
      setAdvice("Erro ao buscar frase. Tente novamente mais tarde.");
    }
  };

  const handleDisplayBar = () => {
    if (displayed) {
      setDisplayed(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
    setDisplayed(true);
  }, []);

  return (
    <div id="advice-bar" className="absolute top-25 z-1000 min-w-5/12 max-w-7/12 transform -translate-x-1/2 left-1/2" style={{ display: displayed ? "block" : "none" }}>
      <div className="mx-auto p-2 flex relative bg-gray-100 hover:bg-white transition-smooth rounded-md border border-tgray/30">
         <button className="absolute cursor-pointer transform -translate-y-1/2 top-1/2 right-3" >
          <HiX onClick={() => handleDisplayBar()} />
        </button>
        <p className="text-center w-full">{advice}</p>
      </div>
    </div>
  );
};
export default DailyAdvice;
