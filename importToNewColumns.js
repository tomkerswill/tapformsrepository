// ========== importToNewColumns Start ========== //
// NAME: importToNewColumns
// VERSION: 1.0.3

/**
 * Imports a file and adds the right columns
 *
 * filename:			The file to import.
 * indexKey:		The field ID of the key field in the table field.
 *
 * return: Empty return value in all cases.
 */

document.getFormNamed('Script Manager').runScriptNamed('Logger');

function importToNewColumns(form, uri, indexKey) {
    console.log("Index Key: " + indexKey);
    const indexKeyId = form.getFieldNamed(indexKey).getId();
    console.log("Index Key Id: " + indexKeyId);

    const jsonFile = uri;

	let rowList = Utils.getJsonFromUrl(jsonFile);
	
	if (!rowList) {
			console.log("No index file?");
		return
	}
		
	for (row of rowList) {
	    console.log("Row: " + JSON.stringify(row))
	    let rowId = row[indexKey];	
	    console.log("Row Id: " + rowId);
	    console.log("Name: " + form.name);
	    let targetRecord = getRecordFromFormWithKey(form.name,indexKeyId, rowId);
	    if (!targetRecord) {
		console.log("Adding new record...");
		targetRecord = form.addNewRecord();
	    }
	    console.log("Record: " + targetRecord.getId());
	    for (const [key, value] of Object.entries(row)) {
		let keyField = form.getFieldNamed(key);
		if (!keyField) {				
		    console.log("Adding field: " + key + "Type: " + typeof(value));
		    if (typeof(value) == "number") {
			fieldType = "number";
		    }
		    else {
			fieldType = "text"
		    }
		    keyField = form.addNewFieldNamedWithType(key,fieldType);
		    form.saveAllChanges();
		}
		keyId = keyField.getId();
  		console.log("Key: " + key + " keyId: " + keyId + " Value: " + value);
  		targetRecord.setFieldValue(keyId, value);
	    }
	}
	form.saveAllChanges();
}
