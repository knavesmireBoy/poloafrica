<?php class Admin
{

    public function insert()
    {
        $conn = getConn();
        $st = prepSQL($conn, 'INSERT INTO user SET name = :name, email = :email, password = :pwd');
        $password = $_POST['password'] != '' ? md5($_POST['password'] . DB_SALT) : '';

        $st->bindValue(':name', $_POST['name']);
        $st->bindValue(':pwd', $password);
        $st->bindValue(':email', $_POST['email']);
        doPreparedQuery($st, 'Error adding submitted user.');
        $id = $conn->lastInsertId();
        if (isset($id) && isset($_POST['roles']))
        {
            foreach ($_POST['roles'] as $role)
            {
                $st = $conn->prepare('INSERT INTO userrole SET user_id = :id, role_id = :role');
                $st->bindValue(':id', $id);
                $st->bindValue(':role', $role);
                doPreparedQuery($st, 'Error assigning selected role to user.');
            }
            $conn = null;
        }
    }

    public function getList()
    {
        $conn = getConn();
        $stmt = $conn->query("SELECT id, name FROM user");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getRoles()
    {
        $conn = getConn();
        $stmt = $conn->query("SELECT * FROM role");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id)
    {
        $conn = getConn();
        $st = $conn->prepare("SELECT * FROM user WHERE id=:id");
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        $st->execute();
        return $st->fetch(PDO::FETCH_ASSOC);
    }

    public function delete($id)
    {
        $conn = getConn();
        $st = $conn->prepare('DELETE FROM user WHERE id = :id');
        $st->bindValue(':id', $id);
        $st->execute();
        $conn = null;
    }

    public function getUserRole($id)
    {
        $conn = getConn();
        $st = prepSQL($conn, 'SELECT role_id FROM userrole WHERE user_id = :id');
        $st->bindValue(':id', $id);
        doPreparedQuery($st, 'Error fetching list of assigned roles.');
        $selectedRoles = array();
        foreach ($st as $row)
        {
            $selectedRoles[] = $row['roleID'];
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
        //exit(var_dump($data));
        $conn = getConn();
        $st = prepSQL($conn, 'UPDATE user SET name = :name, email = :email WHERE id = :id');
        $st->bindValue(':id', $data['id']);
        $st->bindValue(':name', $data['name']);
        $st->bindValue(':email', $data['email']);
        doPreparedQuery($st, 'Error updating submitted user.');
        if ($_POST['password'] != '')
        {
            $password = md5($data['password'] . DB_SALT);
            $st = prepSQL($conn, 'UPDATE author SET password = :password WHERE id = :id');
            $st->bindValue(':password', $password);
            $st->bindValue(':id', $data['id']);
            doPreparedQuery($st, 'Error setting user password.');
        }
        $st = prepSQL($conn, 'DELETE FROM userrole WHERE user_id = :id');
        $st->bindValue(':id', $data['id']);
        doPreparedQuery($st, 'Error removing obsolete author role entries.');
        if (isset($data['roles']))
        {
            foreach ($data['roles'] as $role)
            {
                $st = prepSQL($conn, 'INSERT INTO userrole SET user_id= :id, role_id = :role');
                $st->bindValue(':id', $data['id']);
                $st->bindValue(':role', $role);
                doPreparedQuery($st, 'Error assigning selected roles to user.');
            }
        }
    }
}