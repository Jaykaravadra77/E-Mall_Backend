const uniqueMessage = error => {
    let output;
    try {
       
        let fieldName = error.message.substring(
            error.message.indexOf("{") + 2,
            error.message.lastIndexOf(":")
        );
        output =
            fieldName +
            " already exists";
    } catch (ex) {
        output = "Unique field already exists";
    }
//    output = "Email Already exist"
    return output;
};

/**
 * Get the erroror message from error object
 */
exports.errorHandler = error => {
    let message = "";

    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error);
                break;
            default:
                message = "Something went wrong";
        }
    } else {
        for (let errorName in error.errorors) {
            if (error.errorors[errorName].message)
                message = error.errorors[errorName].message;
        }
    }

    return message;
};