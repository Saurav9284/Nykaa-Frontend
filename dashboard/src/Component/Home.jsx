
import React, { useState, useEffect } from "react";
import { Card, Table } from "semantic-ui-react"; // Imported Table component
import {
  Menu,
  MenuItem,
  Select,
  Input,
  Button,
} from "semantic-ui-react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const Home = () => {
  const toast = useToast();

  const [data, setData] = useState([]);
  const [pages, setPages] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNote, setSelectedNote] = useState(null);

  const [name, setName] = useState("");
  const [editname, setEditName] = useState("");
  const [category, setCategory] = useState("");
  const [editcategory, setEditCategory] = useState("");
  const [description, setDescription] = useState("");
  const [editdescription, setEditDescription] = useState("");
  const [gender, setGender] = useState("");
  const [editgender, setEditGender] = useState("");
  const [price, setPrice] = useState("");
  const [editprice, setEditPrice] = useState("");
  const [picture, setPicture] = useState('');
  const [editpicture, setEditPicture] = useState('');

  const [isOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategorygender, setSelectedCategoryGender] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // GET DATA

  const getData = async (page = 1) => {
    const token = sessionStorage.getItem("Token");
    try {
      // API URL
      let apiUrl = `https://nykamock-backend-production.up.railway.app/api/products?page=${page}`;

      //sorting
      if (sortOrder) {
        apiUrl += `&sort=price&order=${sortOrder}`;
      }

      //filter
      if (selectedCategory) {
        apiUrl += `&category=${selectedCategory}`;
      }

      if (selectedCategorygender) {
        apiUrl += `&gender=${selectedCategorygender}`;
      }

      //search
      if (searchTerm) {
        apiUrl += `&name=${searchTerm}`;
      }

      const res = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setPages(res.data.totalPages);
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE NOTE

  const submitAdd = () => {
    const payload = JSON.stringify({ name, picture, description, gender, category, price });
    const token = sessionStorage.getItem("Token");
    fetch("https://nykamock-backend-production.up.railway.app/api/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: payload,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === 'Product added successfully') {
          toast({
            position: "top",
            title: res.msg,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          getData(currentPage);
          setIsCreateOpen(false);
        } else {
          toast({
            position: "top",
            title: res.message || "Not Created",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setIsCreateOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          position: "top",
          title: "An error occurred during Creation ",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setIsCreateOpen(false);
      });
  };

  // DELETE NOTE

  const handleNoteDelete = () => {
    if (!selectedNote) {
      console.error("Selected note is null or undefined");
      setIsDeleteOpen(false);
      return;
    }

    const noteId = selectedNote._id;
    const token = sessionStorage.getItem("Token");

    fetch(
      `https://nykamock-backend-production.up.railway.app/api/products/${noteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.message === 'Product deleted successfully') {
          toast({
            position: "top",
            title: res.message,
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          setData((prevData) => prevData.filter((note) => note._id !== noteId));
          setIsDeleteOpen(false);
        } else {
          toast({
            position: "top",
            title: res.message || "Not Deleted",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setIsDeleteOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          position: "top",
          title: "An error occurred during Deletion",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setIsDeleteOpen(false);
      });
  };

  const Pagination = () => {
    const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1);

    return (
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        {pageNumbers.map((pageNumber) => (
          <Button
            basic
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            primary={currentPage === pageNumber}
          >
            {pageNumber}
          </Button>
        ))}
      </div>
    );
  };

  // EDIT NOTE

  const submitUpdate = () => {
    if (!selectedNote) {
      console.error("Selected note is null or undefined");
      setIsEditOpen(false);
      return;
    }

    const noteId = selectedNote._id;
    const payload = JSON.stringify({
      name: editname,
      picture: editpicture,
      description: editdescription,
      gender: editgender,
      category: editcategory,
      price: editprice
    });
    const token = sessionStorage.getItem("Token");

    fetch(
      `https://nykamock-backend-production.up.railway.app/api/products/${noteId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: payload,
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.message === 'Product Updated Successfully') {
          toast({
            position: "top",
            title: res.message,
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          setData((prevData) =>
            prevData.map((note) =>
              note._id === noteId
                ? {
                  ...note,
                  name: editname,
                  picture: editpicture,
                  description: editdescription,
                  gender: editgender,
                  category: editcategory,
                  price: editprice,
                }
                : note
            )
          );

          setIsEditOpen(false);
        } else {
          toast({
            position: "top",
            title: res.message || "Not Updated",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setIsEditOpen(false);
        }
      })
      .catch((err) => {
        console.error("Error during update:", err);
        toast({
          position: "top",
          title: "An error occurred during Update",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setIsEditOpen(false);
      });
  };

  const sortOptions = [
    { key: "", value: "", text: "Select" },
    { key: "asc", value: "asc", text: "Low to High" },
    { key: "desc", value: "desc", text: "High to Low" },
  ];

  const filterOptionsforgender = [
    { key: "", value: "", text: "Select" },
    { key: "male", value: "male", text: "Male" },
    { key: "female", value: "female", text: "Female" },
  ];
  const filterOptions = [
    { key: "", value: "", text: "Select" },
    { key: "makeup", value: "makeup", text: "Makeup" },
    { key: "skincare", value: "skincare", text: "Skincare" },
    { key: "haircare", value: "haircare", text: "Haircare" },
  ];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    getData(pageNumber);
  };

  const handleNoteClick = (note) => {
    setEditName(note.name);
    setEditPicture(note.picture);
    setEditDescription(note.description);
    setEditGender(note.gender);
    setEditCategory(note.category);
    setEditPrice(note.price);
    setIsEditOpen(true);
    setSelectedNote(note);
  };

  useEffect(() => {
    getData();
  }, [currentPage, sortOrder, selectedCategory, selectedCategorygender, searchTerm]);


  return (
    <div className="homeOperation">
      <Menu secondary>
        <MenuItem>
          <Select
            placeholder="Sort by price"
            options={sortOptions}
            value={sortOrder}
            onChange={(e, { value }) => setSortOrder(value)}
          />
        </MenuItem>
        <MenuItem>
          <Input
            icon="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </MenuItem>

        <MenuItem>
          <Select
            placeholder="Filter by category"
            options={filterOptions}
            value={selectedCategory}
            onChange={(e, { value }) => setSelectedCategory(value)}
          />
        </MenuItem>
        <MenuItem>
          <Select
            placeholder="Filter by gender"
            options={filterOptionsforgender}
            value={selectedCategorygender}
            onChange={(e, { value }) => setSelectedCategoryGender(value)}
          />
        </MenuItem>
        <MenuItem>
          <>
            <Button basic color="blue" onClick={() => setIsCreateOpen(true)}>
              Add
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsCreateOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create new product</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Picture</FormLabel>
                    <Input
                      placeholder="Enter picture url"
                      value={picture}
                      onChange={(e) => setPicture(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input
                      placeholder="Enter Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      placeholder="Choose gender"
                      options={filterOptionsforgender}
                      value={gender}
                      onChange={(e, { value }) => setGender(value)}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Category</FormLabel>
                    <Select
                      placeholder="Choose category"
                      options={filterOptions}
                      value={category}
                      onChange={(e, { value }) => setCategory(value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input
                      placeholder="$"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button mr={3} onClick={submitAdd}>
                    Create
                  </Button>
                  <Button
                    color="red"
                    onClick={() => setIsCreateOpen(false)}
                    basic
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        </MenuItem>
      </Menu>
      <Table celled>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Picture</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Gender</Table.HeaderCell>
            <Table.HeaderCell>Category</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.map((note) => (
            <Table.Row key={note._id} textAlign="center" >
              <Table.Cell>{note.name}</Table.Cell>
              <Table.Cell>{note.picture}</Table.Cell>
              <Table.Cell>{note.description}</Table.Cell>
              <Table.Cell>{note.gender}</Table.Cell>
              <Table.Cell>{note.category}</Table.Cell>
              <Table.Cell>{note.price}</Table.Cell>
              <Table.Cell>
                <Button
                  basic
                  color="green"
                  onClick={() => handleNoteClick(note)}
                >
                  Edit
                </Button>
                <Button
                  basic
                  color="red"
                  onClick={() => {
                    setSelectedNote(note);
                    setIsDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Edit product</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter name"
          value={editname}
          onChange={(e) => setEditName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Picture</FormLabel>
        <Input
          placeholder="Enter picture url"
          value={editpicture}
          onChange={(e) => setEditPicture(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Input
          placeholder="Enter Description"
          value={editdescription}
          onChange={(e) => setEditDescription(e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Gender</FormLabel>
        <Select
          placeholder="Choose gender"
          options={filterOptionsforgender}
          value={editgender}
          onChange={(e, { value }) => setEditGender(value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Category</FormLabel>
        <Select
          placeholder="Choose category"
          options={filterOptions}
          value={editcategory}
          onChange={(e, { value }) => setEditCategory(value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Price</FormLabel>
        <Input
          placeholder="$"
          value={editprice}
          onChange={(e) => setEditPrice(e.target.value)}
        />
      </FormControl>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={submitUpdate} className="linear">
        Save
      </Button>
      <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this note?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleNoteDelete} >
              Delete
            </Button>
            <Button onClick={() => setIsDeleteOpen(false)} className="linear">Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Pagination/>
    </div>

  );
};

export default Home;