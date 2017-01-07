'use strict';
const getFrom = (url, cb) => {
    try {
        $.get( url, (data) => {
            cb(null, data);
        }).fail((err) => {
            cb(err);
        });
    } catch (err) {
        cb(err);
    }
};

const postTo = (url, data, cb) => {
    try {
        $.post( url, data, (data) => {
            cb(null, data);
        }).fail((err) => {
            cb(err);
        });
    } catch (err) {
        cb(err);
    }
};

const putTo = (url, data, cb) => {
    try {
        $.ajax({
            url: url,
            type: 'PUT',
            success: (data) => {
                cb(null, data);
            },
            error: (err) => {
                cb(err);
            }
        });
    } catch (err) {
        cb(err);
    }
};