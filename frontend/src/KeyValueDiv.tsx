import { useEffect, useState } from "react";
import { getKeyValueItem, putKeyValueItem } from "./api";

const cheveronDown = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const cheveronRight = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

function EditKeyValueDiv(props: any) {
  const [contentType, setContentType] = useState<string>(props.contentType);
  const [value, setValue] = useState<string>(props.value);

  const disabledClass = !value || !contentType ? "cursor-not-allowed opacity-50 " : "";

  const saveInput = async () => {
    putKeyValueItem(props.name, value, contentType)
      .then(() => props.onSave())
  };

  return (
    <div>
      <hr className="my-8"/>

      {/* key content type input */}
      <div className="col-span-6 sm:col-span-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new_key_content_type">
          Content Type
        </label>
        <input
          className="shadow appearance-none border rounded py-2 px-3 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="new_key_content_type"
          type="text"
          value={contentType}
          onChange={(event) => setContentType(event.target.value)}
        />
      </div>

      {/* key value input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mt-3 mb-2" htmlFor="new_key_value">
          Value
        </label>
        <textarea
          rows={3}
          className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="new_key_value"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>

      <div className="w-full">
        <div className="py-3 text-right float-left">
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={props.onDelete}
          >
            Delete
          </button>
        </div>

        <div className="py-3 text-right float-right">
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent mr-4 shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={props.onCancel}
          >
            Cancel
          </button>

          <button
            className={ disabledClass + "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"}
            onClick={saveInput}
            disabled={!value || !contentType}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewKeyValueDiv(props: any) {
  return (
    <div>
      <hr className="my-8"/>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mt-3 mb-2" htmlFor="new_key_value">
          Content Type
        </label>
        <div className="rounded bg-gray-300 p-4">
          <pre className="whitespace-pre-wrap">
            {props.contentType}
          </pre>
        </div>

        <label className="block text-gray-700 text-sm font-bold mt-3 mb-2" htmlFor="new_key_value">
          Value
        </label>
        <div className="rounded bg-gray-300 p-4">
          <pre className="whitespace-pre-wrap">
            {props.value}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default function KeyValueDiv(props: any) {
  const keyName: string = props.name;
  const [value, setValue] = useState<any | undefined>(undefined);
  const [contentType, setContentType] = useState<string | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const loadItem = () => {
    getKeyValueItem(props.name).then((res: any) => {
      if (typeof res.data === 'object') {
        setValue(JSON.stringify(res.data));
      } else {
        setValue(res.data);
      }
      setContentType(res.headers['content-type']);
    });
  }

  useEffect(() => loadItem(), []);

  const toggleIsEditing = () => setIsEditing(!isEditing);
  const toggleIsExpanded = () => {
    setIsExpanded(!isExpanded);
    setIsEditing(false);
  }

  const saveCallback = async () => {
    await loadItem();
    toggleIsEditing();
  }

  const cancelCallback = async () => {
    toggleIsEditing();
  }

  const onDelete = async () => {
    await setIsEditing(false);
    props.onDelete(props.name);
  };

  const internalDiv = isExpanded
    ? isEditing
      ? (<EditKeyValueDiv name={keyName} value={value} contentType={contentType} onSave={saveCallback} onCancel={cancelCallback} onDelete={onDelete} />)
      : (<ViewKeyValueDiv name={keyName} value={value} contentType={contentType} />)
    : (<></>);

  return (
    <div className="border rounded w-full p-8">
      <div className="w-full" onClick={toggleIsExpanded}>
        <strong> {keyName} </strong>
        <div className="float-right">
          { isExpanded ? cheveronDown : cheveronRight }
        </div>
      </div>

      { internalDiv }

      { isExpanded && !isEditing
        ? <button
            className="float-right py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={toggleIsEditing}
          >
            Edit
          </button>
        : <></>
      }
    </div>
  );
}