import React, { useEffect, useState } from "react";
import SharedContext from './utility/context';
import './AdminContent.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";

function AdminContent() {
    const { menuData, setMenuData } = React.useContext(SharedContext);
    const [unsavedChanges, setUnusedChanges] = useState(false); 

    if (!menuData || !menuData.categories) {
        return <div className="menu">Loading...</div>;
    }

    const categories = menuData.categories;
    const options = menuData.options;

    const deleteItem = (categorieID, itemID) => {
        delete menuData.categories[categorieID].items[itemID];
        setMenuData({ ...menuData })
        setUnusedChanges(true);
    };

    const deleteSection = (categorieID) => {
        delete menuData.categories[categorieID];
        setMenuData({ ...menuData })
        setUnusedChanges(true);
    };

    const deleteOption = (optionID) => {
        delete menuData.options[optionID];
        setMenuData({ ...menuData })
        setUnusedChanges(true);
    };

    const saveChanges = async () => {
        var content = menuData;
        content.token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3001/editMenu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(content)
            });

            if (response.ok) {
                const data = await response.text();
                const success = JSON.parse(data).success;

                if (!success) {
                    console.error('save failed');
                    return;
                }

                setUnusedChanges(false);

            } else {
                // Handle an error response (e.g., show an error message)
                console.error('Login failed');
            }
        } catch (error) {
            // Handle any network or request error
            console.error('Error:', error);
        }

    }

    const addOptionChoice = (choiceID) => {
        console.log(choiceID)
        menuData.options[choiceID].values[""] = 0;
        setMenuData({ ...menuData })
        setUnusedChanges(true);
    }

    const addOption = () => {
        const randID = Math.random().toString(36).substr(2, 9);
        menuData.options[randID] = {
            name: "",
            description: "",
            multipleChoice: false,
            required: false,
            values: {}
        }
        setMenuData({ ...menuData })
        setUnusedChanges(true);
    }

    const addItem = (categorieID) => {
        const randID = Math.random().toString(36).substr(2, 9);
        menuData.categories[categorieID].items[randID] = {
            name: "",
            description: "",
            price: 0,
            options: []
        }
        setMenuData({ ...menuData })
        setUnusedChanges(true);
    }

    const addSection = () => {
        const randID = Math.random().toString(36).substr(2, 9);
        menuData.categories[randID] = {
            name: "",
            description: "",
            items: {}
        }
        setMenuData({ ...menuData })
        setUnusedChanges(true);
    }

    const editItem = (categorieID, itemID, name, description, price, options, newOption, newOptionVal) => {

        if (newOption) {
            if (newOptionVal) {
                if (!options.includes(newOption))
                    options.push(newOption)
            } else {
                options.splice(options.indexOf(newOption), 1)
            }
        }
        menuData.categories[categorieID].items[itemID] = {
            name: name,
            description: description,
            price: price,
            options: options
        }
        console.log(menuData.categories[categorieID].items[itemID])
        setMenuData({ ...menuData })
        setUnusedChanges(true);
    }

    const editSection = (categorieID, name, description) => {
        menuData.categories[categorieID].name = name;
        menuData.categories[categorieID].description = description;
        setMenuData({ ...menuData })
        setUnusedChanges(true);
    }

    const editTax = (tax) => {
        menuData.tax = tax;
        setMenuData({ ...menuData })
        setUnusedChanges(true);
    }
    
    const editOption = (optionID, name, description, multipleChoice, required, values, oldKey, newKey, newVal) => {

        if (oldKey != undefined && newKey != undefined && newVal != undefined) {
            delete values[oldKey];
            if (newKey != "") values[newKey] = newVal;
        }

        menuData.options[optionID] = {
            name: name,
            description: description,
            multipleChoice: multipleChoice,
            required: required,
            values: values
        }

        console.log(menuData.options[optionID])

        setMenuData({ ...menuData })
        setUnusedChanges(true);
    }

    return (

        <div>
            
            {unsavedChanges ? 
            <div className="warning-header"> 
                <p className="warning-text">Don't forget to save your changes!</p>
                <button className="save-button" onClick={() => saveChanges()}>Save</button>
            </div> : ""}

             <div className="content">
                <h2 className="section-title">Store Data</h2>
                <p className="tax">
                    <strong>Tax:</strong> <input type="text" defaultValue={menuData.tax} onChange={(event) => editTax(event.target.value)}/>
                </p>

                <h2 className="section-title">Sections</h2> <button className="add-section" onClick={() => addSection()}>Add Section</button>
            
                {Object.keys(categories).map((categoryId) => {
                    const category = categories[categoryId];
                    return (
                    <div key={categoryId} className="category">
                        <h3 className="category-title">
                        <input type="text" defaultValue={category.name} onChange={(event) => editSection(categoryId, event.target.value, category.description)}/>
                        </h3>
                        <p className="category-description">
                        <input type="text" defaultValue={category.description} onChange={(event) => editSection(categoryId, category.name, event.target.value)}/>
                        <button className="add-section" onClick={()=> addItem(categoryId)}>Add Item</button>
                        </p>
            
                        {Object.keys(category.items).map((itemId) => {
                        const item = category.items[itemId];
                        return (
                            <div key={itemId} className="item">
                            
                            <div className="item-info">
                                <h4 className="item-title">
                                Name: <input type="text" defaultValue={item.name} onChange={(event) => editItem(categoryId, itemId, event.target.value, item.description, item.price, item.options)}/>
                                </h4>
                                <p className="item-description">
                                Info: <input type="text" defaultValue={item.description} onChange={(event) => editItem(categoryId, itemId, item.name, event.target.value, item.price, item.options)}/>
                                </p>
                                <p className="item-price">
                                $<input type="text" defaultValue={item.price} onChange={(event) => editItem(categoryId, itemId, item.name, item.description, event.target.value, item.options)}/>
                                </p>
                                {
                                <div className="item-options">
                                    <h3>Options:</h3>
                                    {Object.keys(options).map((optionId) => {
                                    const option = options[optionId];
                                    return (
                                        <div key={optionId} className="option-info">
                                        <label className="option-label">
                                            <input
                                            type="checkbox"
                                            defaultChecked={item.options.includes(optionId)}
                                            onChange={(event) => editItem(categoryId, itemId, item.name, item.description, item.price, item.options, optionId, event.target.checked)} />
                                            {option.name}
                                        </label>
                                        </div>
                                    );
                                    })}
                                </div>
                                }
                            </div>
                            <IconButton className="delete-button" onClick={() => deleteItem(categoryId,itemId)}><DeleteIcon /></IconButton>
                            </div>
                        );
                        })}
                        <IconButton className="delete-button" onClick={() => deleteSection(categoryId)}><DeleteIcon /></IconButton>
                    </div>
                    );
                })}
            
                <h2 className="section-title">Options</h2>
                <button className="add-section" onClick={() => addOption()}>Add Option</button> <br />
                {Object.keys(options).map((optionId) => {
                    const option = options[optionId];
                    return (
                    <div key={optionId} className="option">
                        <h3 className="option-title">
                        <input type="text" defaultValue={option.name} onChange={(event) => editOption(optionId, event.target.value, option.description, option.multipleChoice, option.required, option.values)}/>
                        </h3>
                        <p className="option-description">
                        <input type="text" defaultValue={option.description} onChange={(event) => editOption(optionId, option.name, event.target.value, option.multipleChoice, option.required, option.values)} />
                        </p>
                        <div className="option-info">
                        <div className="option-multiple-choice">
                            <label className="option-label">
                            <input
                                type="checkbox"
                                defaultChecked={option.multipleChoice}
                                onChange={(event) => editOption(optionId, option.name, option.description, event.target.checked, option.required, option.values)} />
                            Multiple Choice
                            </label>
                        </div>
                        <div className="option-required">
                            <label className="option-label">
                            <input
                                type="checkbox"
                                defaultChecked={option.required}
                                onChange={(event) => editOption(optionId, option.name, option.description, option.multipleChoice, event.target.checked, option.values)} />
                            Required
                            </label>
                        </div>
                        <ul className="values-list">
                            {Object.keys(option.values).map((valueName) => (
                            <li key={valueName} className="value">
                                <input type="text" defaultValue={valueName}                onBlur={(event) => editOption(optionId, option.name, option.description, option.multipleChoice, option.required, option.values, valueName, event.target.parentElement.children[0].value, event.target.parentElement.children[1].value)} />:
                                <input type="text" defaultValue={option.values[valueName]} onBlur={(event) => editOption(optionId, option.name, option.description, option.multipleChoice, option.required, option.values, valueName, event.target.parentElement.children[0].value, event.target.parentElement.children[1].value)}/>
                            </li>
                            ))}
                        </ul>
                        <button className="add-section" onClick={() => addOptionChoice(optionId)}>Add Choice</button>
                        </div>
                        
                        <IconButton className="delete-button" onClick={() => deleteOption(optionId)}><DeleteIcon /></IconButton>
                    </div>
                    );
                })}
            </div>

        </div>
      );
      
      
      
    
    

    
}

export default AdminContent;