import { useState } from "react";
import { putKeyValueItem } from "./api";

export default function CreateKeyValueDiv(props: any) {
  const [name, setName] = useState<string>('');
  const [contentType, setContentType] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const saveCallback = props.onSave;

  const disabledClass = !name || !value || !contentType ? "cursor-not-allowed opacity-50 " : "";

  const saveInput = async () => {
    if (!name || !value || !contentType) {
      return
    }
    putKeyValueItem(name, value, contentType)
      .then(() => {
        // Once created, clear the input fields and refresh the main list
        setName('')
        setContentType('')
        setValue('')
        // Call the callback if provided
        if (saveCallback) {
          saveCallback();
        }
      })
  };

  return (
    <div>
      <div className="grid grid-cols-6 gap-6">
        {/* key name input */}
        <div className="col-span-6 sm:col-span-3">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new_key_name">
            Key Name
          </label>
          <input
            className="shadow appearance-none border rounded py-2 px-3 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="new_key_name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

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

      <div className="px-4 py-3 text-right sm:px-6">
        <button
          className={ disabledClass + "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"}
          onClick={saveInput}
          disabled={!name || !value || !contentType}
        >
          Save
        </button>
      </div>
    </div>
  );
}