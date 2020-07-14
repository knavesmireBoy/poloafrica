<?php class Admin
{

    public $id = null;
    
    public function insert()
    {
        $conn = getConn();
        $st = prepSQL($conn, 'INSERT INTO user SET name = :name, email = :email, password = :pwd');
        $password = $_POST['password'] != '' ? md5($_POST['password'] . DB_SALT) : '';

        $st->bindValue(':name', $_POST['name'], PDO::PARAM_STR);
        $st->bindValue(':pwd', $password, PDO::PARAM_STR);
        $st->bindValue(':email', $_POST['email'], PDO::PARAM_STR);
        doPreparedQuery($st, 'Error adding submitted user.');
        $id = $conn->lastInsertId();
        if (isset($id) && isset($_POST['roles']))
        {
            foreach ($_POST['roles'] as $role)
            {
                $st = prepSQL($conn, 'INSERT INTO userrole SET user_id = :id, role_id = :role');
                $st->bindValue(':id', $id, PDO::PARAM_INT);
                $st->bindValue(':role', $role,  PDO::PARAM_INT);
                doPreparedQuery($st, 'Error assigning selected role to user.');
            }
            $conn = null;
        }
    }

    public function getList()
    {
        $conn = getConn();
        $st = prepSQL($conn, "SELECT id, name FROM user");
        doPreparedQuery($st, 'Error retreiving list of users');
        $res = $st->fetchAll(PDO::FETCH_ASSOC);
        $conn = null;  
        return $res;
    }

    public function getRoles()
    {
        $conn = getConn();
        $st = prepSQL($conn, "SELECT * FROM role");
        doPreparedQuery($st, 'Error retreiving roles');
        $res = $st->fetchAll(PDO::FETCH_ASSOC);
        $conn = null;  
        return $res;
    }

    public function getById($id)
    {
        $conn = getConn();
        if(isset($id)){
            $this->id = $id;
            $st = prepSQL($conn, "SELECT * FROM user WHERE id=:id");
            $st->bindValue(":id", $id, PDO::PARAM_INT);
            doPreparedQuery($st, 'Error retreiving user details');
            $res = $st->fetch(PDO::FETCH_ASSOC);
            $conn = null;  
            return $res;
        }
        else {
            $max = $conn->query("SELECT MAX(id) FROM user")->fetch()[0];
            $conn = null;
            $this->id = $max;
            return $max;
        }
    }
    
    public function getByEmail($email){
        $conn = getConn();        
        $st = prepSQL($conn, "SELECT id, name FROM user WHERE email=:email");
        $st->bindValue(":email", $email, PDO::PARAM_STR);
        doPreparedQuery($st, 'Error retreiving user credentials');
        $res = $st->fetch(PDO::FETCH_ASSOC);
        $conn = null;  
        return $res;
    }

    public function delete($id)
    {
        $conn = getConn();
        $st = prepSQL($conn, 'DELETE FROM user WHERE id = :id');
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error deleting user from database');
        $conn = null;
    }

    public function getUserRole($id)
    {
        $conn = getConn();
        $st = prepSQL($conn, 'SELECT role_id FROM userrole WHERE user_id = :id');
        $st->bindValue(':id', $id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error fetching list of assigned roles.');
        $selectedRoles = array();
        foreach ($st as $row)
        {
            $selectedRoles[] = $row['role_id'];
        }
        $st = prepSQL($conn, 'SELECT * FROM role');
        doPreparedQuery($st, 'Error fetching list of roles.');
        foreach ($st as $row)
        {
            $roles[] = array(
                'id' => $row['id'],
                'description' => $row['description'],
                'selected' => in_array($row['id'], $selectedRoles)
            );
        }
        $conn = null;
        return $roles;
    }

    public function update($data)
    {
        $conn = getConn();
        $st = prepSQL($conn, 'UPDATE user SET name = :name, email = :email WHERE id = :id');
        $st->bindValue(':id', $data['id'], PDO::PARAM_INT);
        $st->bindValue(':name', $data['name'], PDO::PARAM_STR);
        $st->bindValue(':email', $data['email'], PDO::PARAM_STR);
        doPreparedQuery($st, 'Error updating submitted user.');
        if ($_POST['password'] != '')
        {
            $password = md5($data['password'] . DB_SALT);
            $st = prepSQL($conn, 'UPDATE author SET password = :password WHERE id = :id');
            $st->bindValue(':password', $password, PDO::PARAM_STR);
            $st->bindValue(':id', $data['id'], PDO::PARAM_INT);
            doPreparedQuery($st, 'Error setting user password.');
        }
        $st = prepSQL($conn, 'DELETE FROM userrole WHERE user_id = :id');
        $st->bindValue(':id', $data['id'], PDO::PARAM_INT);
        doPreparedQuery($st, 'Error removing obsolete author role entries.');
        if (isset($data['roles']))
        {
            foreach ($data['roles'] as $role)
            {
                $st = prepSQL($conn, 'INSERT INTO userrole SET user_id= :id, role_id = :role');
                $st->bindValue(':id', $data['id'], PDO::PARAM_INT);
                $st->bindValue(':role', $role, PDO::PARAM_INT);
                doPreparedQuery($st, 'Error assigning selected roles to user.');
            }
        }
    }
}