    $(document).ready(function() {
        buildTable();
        $("#addContact").click(insertElement);
    });

    function buildTable()
    {
        $.post( "https://portal.genioo.com/tools/a/server/router.php", {request: 'getList'})
            .done(function(data) {
                var contacts = Object.values(JSON.parse(data).records);
                var tbl = '<table class="responsive-table" id="contactsTable">';
                    tbl +='<thead>';
                        tbl +='<tr>';
                        tbl +='<th>Id</td>';
                        tbl +='<th>First Name</th>';
                        tbl +='<th>Last Name</th>';
                        tbl +='<th>Email</th>';
                        tbl +='<th>Phone</th>';
                        tbl +='</tr>';
                    tbl +='</thead>';            
                    tbl +='<tbody>';
                        $.each(contacts, function(index, val) 
                        {
                            var row_id = val.Id;
                            tbl +='<tr row_id="'+row_id+'">';
                                tbl +='<td class="Id">'+row_id+'</td>';
                                tbl +='<td><input type="text" class="FirstName" onchange="modifyField(this)" value="'+val.FirstName+'"/></td>';
                                tbl +='<td><input type="text" class="LastName" onchange="modifyField(this)" value="'+val.LastName+'"/></td>';
                                tbl +='<td><input type="text" class="Email" onchange="modifyField(this)" value="'+val.Email+'"/></td>';
                                tbl +='<td><input type="text" class="Phone" onchange="modifyField(this)" value="'+val.Phone+'"/></td>';
                                tbl +='<td> <i class="small material-icons" onclick="deleteContact(this)" delete_id="'+ row_id +'">delete</i></td>';
                            tbl +='</tr>';
                        });
                    tbl +='</tbody>';
                tbl +='</table>';
                $('#contactsTable').html(tbl);
            });
    }

    function modifyField(elem)
    {
        var contacts = generateArray();
        $.each(contacts, function(index,val){
            if(val['Id'] == $(elem).parent().parent().attr('row_id'))
            {
                var row = new Object;
                row.FirstName = val['FirstName'];
                row.LastName = val['LastName'];
                row.Email = val['Email'];
                row.Phone = val['Phone'];
                var data = JSON.stringify(row);
                $.post("https://portal.genioo.com/tools/a/server/router.php", {"request": "update","id": val['Id'], "data": data})
                .done(function(res){
                    if(!res == null){
                        console.log(res);
                    }else{
                        console.log("modify success!");
                    }
                });
            }
        });             
    }

    function generateArray()
    {
        contacts = [];
        $('tr').each(function(index,val){
            contacts[index] = new Object();
            contacts[index].FirstName = $(this).find('.FirstName').val();
            contacts[index].LastName = $(this).find('.LastName').val();
            contacts[index].Email = $(this).find('.Email').val();
            contacts[index].Phone = $(this).find('.Phone').val();
            contacts[index].Id = $(this).find('.Id').text();
        });
        contacts.shift();
        return contacts;
    }

    function deleteContact(elem)
    {
        var elemID = $(elem).attr('delete_id');
        $(elem).parent().parent().remove();
        $.post("https://portal.genioo.com/tools/a/server/router.php", {"request": "delete","id": elemID})
                .done(function(res){
                    if(!res == null){
                        console.log(res);
                    }else{
                        console.log("delete success!");
                    }
                });
    }
    id = 0;
    function generateInternalId(){
        return id++;
    }

    function insertElement(){
        var row = '';
        id = generateInternalId();
        row +='<tr row_id="'+ id +'">';
            row +='<td class="Id"></td>';
            row +='<td><input type="text" class="FirstName" onchange="modifyField(this)" value=""/></td>';
            row +='<td><input type="text" class="LastName" onchange="modifyField(this)" value=""/></td>';
            row +='<td><input type="text" class="Email" onchange="modifyField(this)" value=""/></td>';
            row +='<td><input type="text" class="Phone" onchange="modifyField(this)" value=""/></td>';
            row +='<td> <i class="small material-icons" onclick="confirmInsert(this)" id="'+ id +'">done</i></td>';
            row +='<td> <i class="small material-icons" onclick="deleteContact(this)" delete_id="'+ id +'">delete</i></td>';
        row +='</tr>';
        $('tbody').append(row);

    }

    function confirmInsert(elem){
        var contact = new Object;
        contact.FirstName = $(elem).parent().parent().find('.FirstName').val();
        contact.LastName = $(elem).parent().parent().find('.LastName').val();
        contact.Email = $(elem).parent().parent().find('.Email').val();
        contact.Phone = $(elem).parent().parent().find('.Phone').val();
        var data = JSON.stringify(contact);
        alert(data);
        $.post("https://portal.genioo.com/tools/a/server/router.php", {"request": "insert","data": data})
                .done(function(res){
                        id = JSON.parse(res).id;
                        $(elem).parent().parent().find('.Id').text(id);
                        $(elem).parent().parent().attr("row_id",id);
                        $(elem).parent().attr("delete_id",id);
                        $(elem).parent().remove();
                    }
                );
    }