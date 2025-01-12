import React, { useState, useEffect, useCallback, useContext } from "react";

//libraries
import { Button, Input, Radio, Tabs, Modal, Form } from "antd";
import { BsRobot } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa6";

//Hooks
import useAssistantFileUpload from "../../../Hooks/useAssistantFileUpload";

//Components
import AssistantForm from "./AssistantForm";
import { getUserID } from "../../../Utility/service";
import { AssistantContext } from "../../../contexts/AssistantContext";
const { TabPane } = Tabs;

const CreateAssistantModal = ({ data }) => {
  const {
    assistantData,
    setAssistantData,
    showModal,
    handleClose,
    editMode,
    isAdmin,
    handleFetchUserCreatedAssistants,
    handleFetchAllAssistants
  } = data;
  const [form] = Form.useForm();
  const [deleteFileIds, setDeleteFileIds] = useState([]);
  const [selectedTools ,setSelectedTools] =  useState([]);

  const { triggerRefetchAssistants } = useContext(AssistantContext);

  //----Callback----//
  const handleDeleteFileId = useCallback(
    (index) => {
      const fileId = assistantData.file_ids[index];
      setDeleteFileIds((prev) => [...prev, fileId]);
    },
    [assistantData.file_ids, setDeleteFileIds]
  );

  //--Side Effects---//
  useEffect(() => {
    form.setFieldsValue(assistantData);
    setFileList(
      assistantData?.fileNames
        ? assistantData?.fileNames.map((file, index) => ({
            uid: `existing-${index}`,
            name: file,
            status: "done",
          }))
        : []
    );
    
    setDeleteFileIds([]);
  }, [assistantData, form]);

  // console.log(assistantData)

  //------Hooks Declaration ------//
  const {
    fileList,
    setFileList,
    isUploading,
    handleCreateOrUpdateAssistantWithFiles,
    handleRemoveFile,
    handleAddFile,
  } = useAssistantFileUpload(handleDeleteFileId,selectedTools);

  //------Api calls --------//
  const handleUploadFileAndCreateAssistant = async () => {
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append("files", file);
    });
    if (deleteFileIds.length > 0) {
      formData.append("deleted_files", JSON.stringify(deleteFileIds));
    }
    if(!editMode){
      formData.append("userId", getUserID());
    }
    if (!isAdmin ) {
      formData.append("category", "PERSONAL");
    }
    const formValues = form.getFieldsValue();
    Object.entries(formValues).forEach(([key, value]) => {
      if (key === "tools") {
        formData.append("tools", JSON.stringify(value));
      } 
      else if(key === "static_questions"){
        formData.append("staticQuestions", JSON.stringify(value));
      }
      else {
        formData.append(key, value);
      }
    });
    const success = await handleCreateOrUpdateAssistantWithFiles(
      formData,
      editMode,
      assistantData?.assistant_id
    );

    if (success) {
      console.log("success");
      handleClose();
      handleFetchUserCreatedAssistants();
      if(editMode) {
        // update assistant list
        triggerRefetchAssistants();
      }
      if(isAdmin){
      handleFetchAllAssistants(1);
      }
    }
  };

  //----Local Functions--------//
  const handleFormChange = (changedValues, allValues) => {
    setAssistantData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };
  
  const handleSwitchChange = (tool, checked) => {
    const tools = form.getFieldValue("tools") || [];

    const updatedTools = checked
      ? [...tools, tool]
      : tools.filter((existingTool) => existingTool !== tool);
    form.setFieldsValue({ tools: updatedTools });
    setSelectedTools([updatedTools])
  };


  const [activeKey, setActiveKey] = useState("unoptimized-data");
  function handleTabChange(key) {
    setActiveKey(key);
  }

  return (
    <>
      <Modal
        title={editMode ? "" : "Create Assistant"}
        open={showModal}
        onCancel={handleClose}
        afterClose={() => setActiveKey("unoptimized-data")}
        okButtonProps={{
          disabled: true,
        }}
        cancelButtonProps={{
          disabled: true,
        }}
        width={700}
        footer={null}
      >
        <Tabs
          defaultActiveKey="unoptimized-data"
          activeKey={activeKey}
          onChange={handleTabChange}
          className="mb-3 custom-tab"
          tabBarStyle={{ justifyContent: "space-around" }}
          centered
        >
          <TabPane
            key="unoptimized-data"
            tab={
              <div
                style={{
                  display: "flex",
                  gap: ".6rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {editMode ? "" : <BsRobot />}
                <span>{editMode ? "Update Assistant" : "New Assistant"}</span>
              </div>
            }
          >
            <AssistantForm
              data={{
                form,
                handleFormChange,
                handleSwitchChange,
                isAdmin,
                handleUploadFileAndCreateAssistant,
                fileList,
                isUploading,
                handleRemoveFile,
                handleAddFile,
                assistantData,
                setAssistantData,
                editMode,
              }}
            />
          </TabPane>
          {editMode ? null : (
            <TabPane
              key={"optimized-data"}
              tab={
                <div
                  style={{
                    display: "flex",
                    gap: ".6rem",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FaHashtag />
                  <span>New Assistant by ID</span>
                </div>
              }
            >
              <Form
                form={form}
                layout="vertical"
                style={{
                  width: "100%",
                }}
              >
                <Form.Item style={{ width: '100%' }} label="Assistant ID" name="assistantId">
                  <Input placeholder="Enter  assistant ID" />
                </Form.Item>
                {isAdmin && (
                  <Form.Item
                    label="Select type"
                    name="category"
                    rules={[
                      {
                        required: true,
                        message: "Please Select the type of assistant",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value="ORGANIZATIONAL">Admin</Radio>
                      <Radio value="PERSONAL">Personal</Radio>
                    </Radio.Group>
                  </Form.Item>
                )}
                <Form.Item label=" " colon={false}>
                  <Button
                    style={{  display: 'block', marginLeft: 'auto' }}
                    type="primary"
                    onClick={handleUploadFileAndCreateAssistant}
                  >
                    Create Assistant
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          )}
        </Tabs>
      </Modal>
    </>
  );
};

export default CreateAssistantModal;
