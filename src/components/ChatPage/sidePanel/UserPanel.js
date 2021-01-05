import React, { useRef } from "react";
import { IoIosChatboxes } from "react-icons/io";
import { Dropdown, Image } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import firebase from "../../../firebase";
import mime from "mime-types";

import { updatePhotoURL } from "../../../redux/actions/user_action";

const UserPanel = () => {
  const user = useSelector((state) => state.user.customerUser);
  const dispatch = useDispatch();
  const handleSignOut = () => {
    console.log("11");
    firebase.auth().signOut();
  };

  const inputOpenImageRef = useRef();

  const onHandledImageChange = () => {
    inputOpenImageRef.current.click();
  };

  const handleUploadImage = async (e) => {
    // upload image at firebase storage
    const file = e.target.files[0]; // file
    // metadata 형식 { contentType: 이미지 형식 }
    const metadata = { contentType: mime.lookup(file.name) };

    try {
      const uploadImageSnapShot = await firebase
        .storage()
        .ref()
        .child(`user_image/${user.uid}`) // 저장되는 폴더명 / 저장파일 이름
        .put(file, metadata); // 파일 metaData

      const downloadURL = await uploadImageSnapShot.ref.getDownloadURL();
      // 현재 사용자 프로필 업데이트
      await firebase.auth().currentUser.updateProfile({
        photoURL: downloadURL,
      });

      // photoURL state 변경
      dispatch(updatePhotoURL(downloadURL));

      // database 내용수정
      firebase
        .database()
        .ref("users")
        .child(user.uid)
        .update({ image: downloadURL });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h3 style={{ display: "flex", marginBottom: "60px" }}>
        <IoIosChatboxes />{" "}
        <div style={{ position: "relative", bottom: "3px" }}>Chat App </div>
      </h3>

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <Image
          src={user && user.photoURL && user.photoURL}
          style={{ width: "30px", height: "30px" }}
          roundedCircle
        />

        <Dropdown>
          <Dropdown.Toggle
            style={{
              backgroundColor: "transparent",
              border: "none",
            }}
            id="dropdown-basic"
          >
            {user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={onHandledImageChange}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleSignOut}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <input
        type="file"
        accept="image/jpeg, image/png"
        style={{ display: "none" }}
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
};

export default UserPanel;
