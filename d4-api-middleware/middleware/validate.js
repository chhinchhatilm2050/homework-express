const validate = (schema) => {
    return (req, res, next) => {
        const errors = [];
        const body = req.body || {};
        for(const field in schema) {
            const rules = schema[field];
            const value = body[field];

            if(rules.required && (value === undefined || value === null || value === "")) {
                errors.push({message: `"${field}" is required`});
                continue;
            }
            if(!rules.required && (value === undefined || value === null || value === "" )) {
                continue;
            }
            if(rules.type === "string" && typeof value !== "string") {
                errors.push({message: `"${field}" must be a number`});
            };
            if(rules.type === "boolean" && typeof value !== "boolean") {
                errors.push({message: `"${field}" must be a boolean`});
            };
            if(rules.type === "array" && !Array.isArray(value)) {
                errors.push({message: `"${field}" must be a array`});
            };
            if(rules.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (typeof value !== "string" || !emailRegex.test(value)) {
                    errors.push({message: `"${field}" must be valid email`})
                }
            };
            if(rules.minLength !== undefined && value.length < rules.minLength) {
                errors.push({
                    message: `"${field}" must be at least ${rules.minLength} characters`
                })
            }
            if(rules.min !== undefined && value < rules.min) {
                errors.push({
                    message: `"${field}" must be at least ${rules.min}`
                })
            }
            if(rules.max !== undefined && value > rules.max) {
                errors.push({
                    message: `"${field}" must be at most ${rules.max}`
                })
            }
        }
        if(errors.length > 0) {
            return res.status(400).json({
                error: 'Validation failed',
                detail: errors
            })
        }
        next()
    }
}

export  {validate};