import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

/*  
  Test de fonctionnement de la fonction déjà présente.
  console.log(( (!type ? data?.events : data?.events) || [] ).filter((event)=> event.type === "conférence"))
  On récupère tous les events de type "conférence"

L'une des tentatives réalisé était la suivante : 
  const filteredEvents = ( ((!type ? data?.events : data?.events) || [] ).filter((e) => e.type === type)).filter((event, index)...
Le soucis avec cette solution, c'est que lorsqu'aucun type n'est selectionné rien ne s'affichait car il n'existe pas de type "tous".
Une autre tentative consistait à utiliser l'argument "event" présent dans la fonction de base.
Pour arriver à cette solution, j'ai pas à pas déconstruit la fonction à travers different " console.log " et test que j'ai réalisé en commentaire plus haut 

Si !type est falsy (null, undefined alors renvoie tout les events, sinon renvoie la liste des events correspondant au type.)  */
  const filteredEvents = ( (!type ? data?.events : data?.events.filter((e) => e.type === type)) || [] ).filter((event, index) => {
    if (
      (currentPage - 1) * PER_PAGE <= index &&
      PER_PAGE * currentPage > index
    ) {
      return true;
    }
    return false;
  });
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
