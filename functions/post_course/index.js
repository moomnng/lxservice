const cloudBase = require('@cloudbase/node-sdk');
const axios = require('axios');

const app = cloudBase.init({});

exports.main = async(event, context) => {
    const company_id = event.company_id;
    const staff_id = event.staff_id;
    const attributes = event.attributes;
    const corp_token = await app.callFunction({
        name: "get_corp_token",
        data: {
            "company_id": company_id
        }
    }).then(function(response) {
        return response.result;
    });

    return await axios.post(process.env.LX_API_URL + "v1/courses",
        {
            "data": {
                "type": "course",
                "attributes": {
                    "title": attributes.title,
                    "content": attributes.content,
                    "media_type": 5,
                    "target_users": attributes.target_users,
                    "video_link": attributes.video_link
                },
                "relationships": {
                    "category": {
                        "data": {
                            "type": "category",
                            "id": attributes.category_id
                        }
                    }
                }
            }
        }, {
            headers: {
                "Content-Type": "application/vnd.api+json",
                "StaffID": staff_id,
                "Authorization": "Bearer " + corp_token
            }
        }).then(function(response) {
            console.log(response.data);
            return response.data.data;
        }
    );
}