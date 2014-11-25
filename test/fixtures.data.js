var ObjectId = require('mongoose').Types.ObjectId;

module.exports.Datakeys = [
    // Immutable key
    // c.norris@expandable.com > default:confirmed
    {
        // 0
        "_id"      : new ObjectId("5433861e80e7329e309c1196"),
        "content"  : "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDQX9B6lQhPiFnsRxqM0jGe5gIYzOTVqomX2Au6ef5ZghVcD1JsbyvXw9WIqTRVp7w30aCXjx2F3sN/YTBRTdxQFdG1w0M6ewRgTopsA88RxC/DPC4TbbcBeiYBw8O/R/5tnZ4APSNr7Ctn9Va9Y10Y4N3cIvjooX4XQe5FwFXM58JK3CMLFVGUucI+Sz2dRGIOcy69UPOxh5XVTi2u++sTlHmBHlk0QCQh5iuvw5MKH6vG+tXn6J9gjorrTud7z64UaFEZSkRpqL9HY38QjS2M2GsSiNfjRrA2jqSGaE/lg1+STDAh2irSnq5VgPn3IOY0PXZP8QpUj8+bOTs8aJvf c.norris@expandable.com",
        "email"    : "c.norris@expandable.com",
        "status"   : "confirmed",
        "name"     : "default",
        "token"    : "gBJDccpUqgprteCg5b3hMAMS",
        "createdAt": new Date(2014, 10, 07, 15, 31, 45)
    },
    // Immutable key
    // c.norris@expandable.com > default:confirmed
    {
        // 0
        "_id"      : new ObjectId("5433861e80e7329e309c1197"),
        "content"  : "ssh-rsa BBBBB3NzaC1yc2EAAAADAQABAAABAQDQX9B6lQhPiFnsRxqM0jGe5gIYzOTVqomX2Au6ef5ZghVcD1JsbyvXw9WIqTRVp7w30aCXjx2F3sN/YTBRTdxQFdG1w0M6ewRgTopsA88RxC/DPC4TbbcBeiYBw8O/R/5tnZ4APSNr7Ctn9Va9Y10Y4N3cIvjooX4XQe5FwFXM58JK3CMLFVGUucI+Sz2dRGIOcy69UPOxh5XVTi2u++sTlHmBHlk0QCQh5iuvw5MKH6vG+tXn6J9gjorrTud7z64UaFEZSkRpqL9HY38QjS2M2GsSiNfjRrA2jqSGaE/lg1+STDAh2irSnq5VgPn3IOY0PXZP8QpUj8+bOTs8aJvf c.norris@expandable.com",
        "email"    : "c.norris@expandable.com",
        "status"   : "confirmed",
        "name"     : "kevin",
        "token"    : "gBJDccpUqgprteCg5b3hMAMT",
        "createdAt": new Date(2014, 10, 07, 15, 31, 45)
    },
    // Mutable key
    // c.norris@expandable.com > children:pending
    {
        // 1
        "_id"      : new ObjectId("5433861e80e7329e309c1198"),
        "content"  : "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDQX9B6lQhPiFnsRxqM0jGe5gIYzOTVqomX2Au6ef5ZghVcD1JsbyvXw9WIqTRVp7w30aCXeRdF3sN/YTBRTdxQ1KUIw0M6ewRgTopsA88RxC/DPC4TbbcBeiYBw8O/R/5tnZ4APSNr7Ctn9Va9Y10Y4N3cIvjooX4XQe5FwFXM58JK3CMLFVGUucI+Sz2dRGIOcy69UPOxh5XVTi2u++sTlHmBHlk0QCQh5iuvw5MKH6vG+tXn6J9gjorrTud7z64UaFEZSkRpqL9HY38QjS2M2GsSiNfjRrA2jqSGaE/lg1+STDAh2irSnq5VgPn3IOY0PXZP8QpUj8+bOTs8aJvf b.norris@expandable.com",
        "email"    : "b.norris@expandable.com",
        "status"   : "pending",
        "name"     : "children",
        "token"    : "gBJDccpUqgprteCg5b3hMACD",
        "createdAt": new Date(2014, 10, 07, 15, 31, 45)
    }
];
