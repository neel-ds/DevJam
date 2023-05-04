import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useAccount, useContractRead } from "wagmi";
import eventABI from "../contracts/event.json";
import { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Button from "@/components/form-elements/button";
import Layout from "@/components/layout/layout";

const Card = ({ key, date, title, img, onClick }) => {
  console.log(img);
  return (
    <div
      className="event-card w-[90%] md:w-[31%] flex flex-col mb-[2%] mr-[2%] rounded-t-[30px]"
      key={key}
    >
      <div
        className={`flex flex-col items-center bg-cover bg-center bg-no-repeat rounded-t-[30px] overflow-hidden shadow-lg  min-h-[100px] md:min-h-[200px]`}
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="event-detail hidden flex-col items-center justify-center bg-[#00000090] w-full min-h-[100px] md:min-h-[200px]">
          <div className="font-bold text-xl mb-2 text-center text-[#ccc]">
            {title}
          </div>
          <div className="w-fit">
            <Button label="Get ticket" onClick={onClick} />
          </div>
        </div>
      </div>
      <div className="bg-[#fefefe60] dark:bg-white/90 flex w-full flex-col items-center justify-center rounded-b-[30px]">
        <p className="text-[#7B3FE4] text-xl py-2">{title}</p>
        <div className="flex w-full px-2 pb-5">
          <p className="text-[#7B3FE4] w-full font-semibold text-center">
            {date}
          </p>
        </div>
      </div>
    </div>
  );
};

const cardData = [];

function ModalComponent({ isOpen, onClose, data, onClick }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="text-[#a13bf7]">{data?.title}</div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="text-gray-600 border-2 w-fit rounded-2xl border-[#a13bf7] py-1 px-2">
              {data?.date}
            </div>
            <div className="text-gray-700">{data?.description}</div>
          </ModalBody>

          <ModalFooter>
            <div className="w-fit">
              <Button label="Buy" onClick={onClick} />
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

const Explore = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState();
  const { address } = useAccount();
  const { data, isError, isLoading } = useContractRead({
    address: "0x4cAD6d1fA95e0090c079D515272c9b23DEF8b298",
    abi: eventABI,
    functionName: "getAllEvents",
    onSuccess: (data) => {
      console.log("Succes");
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const fetchData = async () => {
    for (let event of data) {
      console.log(data);
      if (data.length > cardData.length) {
        cardData.push({
          title: event.name,
          date: event.date,
          description: event.description,
          img: event.posterURL,
        });
      }
      console.log(cardData);
    }
  };

  useEffect(() => {
    if (data) {
      fetchData();
    }
  }, [data]);

  return (
    <Layout headTitle="Explore Event">
      <div className="flex flex-col flex-wrap md:flex-row items-center md:items-start md:justify-start pl-[60px] lg:pl-0">
        {cardData.map((card) => (
          <Card
            key={card.title}
            title={card.title}
            img={card.img}
            date={card.date}
            onClick={() => {
              onOpen();
              setSelectedEvent(card);
            }}
          />
        ))}
      </div>
      <ModalComponent
        isOpen={isOpen}
        onClose={onClose}
        data={selectedEvent}
        onClick={() => {}}
      />
    </Layout>
  );
};

export default Explore;
