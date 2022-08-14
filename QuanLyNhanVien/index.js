function Employee(user, name, email, password, startDate, basicSalary, position, monthlyWorkingHour) {
    this.user = user;
    this.name = name;
    this.email = email;
    this.password = password;
    this.startDate = startDate;
    this.basicSalary = basicSalary;
    this.position = position;
    this.monthlyWorkingHour = monthlyWorkingHour;
}

Employee.prototype.calTotalSalary = function() {
    if (this.position == "Sếp") {
        return this.basicSalary * 3;
    }
    if (this.position == "Trưởng phòng") {
        return this.basicSalary * 2;
    }
    if (this.position == "Nhân Viên") {
        return this.basicSalary;
    }
}

Employee.prototype.employeeRanking = function() {
    if (this.monthlyWorkingHour >= 192) {
        return "Nhân viên xuất sắc";
    }
    if (this.monthlyWorkingHour >= 176) {
        return "Nhân viên giỏi";
    }
    if (this.monthlyWorkingHour >= 160) {
        return"Nhân viên khá";
    }
    if (this.monthlyWorkingHour < 160) {
        return"Nhân viên trung bình";
    }
}

let employees = [];

init();

function init() {
    employees = JSON.parse(localStorage.getItem("employees")) || [];
  
    employees = employees.map((employee) => {
        return new Employee(
            employee.user,
            employee.name,
            employee.email,
            employee.password,
            employee.startDate,
            employee.basicSalary,
            employee.position,
            employee.monthlyWorkingHour
        );
    });

  
    display(employees);
}

function addEmployee() {

    let user = dom("#tknv").value;
    let name = dom("#name").value;
    let email = dom("#email").value;
    let password = dom("#password").value;
    let startDate = dom("#datepicker").value;
    let basicSalary = +dom("#luongCB").value;
    let position = dom("#chucvu").value;
    let monthlyWorkingHour = +dom("#gioLam").value;


    let isValid = validateForm();
    // Kiểm tra nếu form không hợp lệ => kết thúc hàm
    if (!isValid) {
        return;
    }


    let employee = new Employee(
        user,
        name,
        email,
        password,
        startDate,
        basicSalary,
        position,
        monthlyWorkingHour
    );
    console.log(employee);
    
    employees.push(employee);
    localStorage.setItem("employees", JSON.stringify(employees));


    display(employees);


    resetForm();
}   

function deleteEmployee(employeeUser) {

    employees = employees.filter((employee) => {
      return employee.user !== employeeUser;
    });
  
    localStorage.setItem("employees", JSON.stringify(employees));
  
    // Sau khi thay đổi dữ liệu của mảng array, ta cần gọi hàm display và truyền vào array students để cập nhật lại giao diện
    display(employees);
}

function searchEmployee() {
    // DOM
    let searchValue = dom("#searchName").value;
  
    searchValue = searchValue.toLowerCase();
  
    
    let newEmployees = employees.filter((employee) => {
      let type = employee.employeeType.toLowerCase();
      return type.includes(searchValue);
    });
  
    // Gọi hàm display và truyền vào array mới để hiển thị lên giao diện
    display(newEmployees);
}

function selectEmployee(employeeUser) {
    // find hoạt động tương tự findIndex, tuy nhiên thay vì trả về index nó trả về giá trị của phần tử
    // nếu không tìm thấy trả về undefined
    let employee = employees.find((employee) => {
      return employee.user === employeeUser;
    });
  
    if (!employee) {
      return;
    }
    
    // Dùng object employee để fill thông tin lên các input
    dom("#tknv").value = employee.user;
    dom("#name").value = employee.name;
    dom("#email").value = employee.email;
    dom("#password").value = employee.password;
    dom("#datepicker").value = employee.startDate;
    dom("#luongCB").value = employee.basicSalary;
    dom("#chucvu").value = employee.position;
    dom("#gioLam").value = employee.monthlyWorkingHour;
    
  
    // khi cập nhật không được thêm nhân viên
    
    dom("#btnThemNV").disabled = true;
}

function updateEmployee() {

    let user = dom("#tknv").value;
    let name = dom("#name").value;
    let email = dom("#email").value;
    let password = dom("#password").value;
    let startDate = dom("#datepicker").value;
    let basicSalary = +dom("#luongCB").value;
    let position = dom("#chucvu").value;
    let monthlyWorkingHour = +dom("#gioLam").value;

    let isValid = validateForm();
    // Kiểm tra nếu form không hợp lệ => kết thúc hàm
    if (!isValid) {
        return;
    }


    let employee = new Employee(
        user,
        name,
        email,
        password,
        startDate,
        basicSalary,
        position,
        monthlyWorkingHour
    );

  
    let index = employees.findIndex((item) => item.user === employee.user);
    employees[index] = employee;
    localStorage.setItem("employees", JSON.stringify(employees));
  

    display(employees);
  
    resetForm();
}

function display(employees) {
    let html = employees.reduce((result, employee) => {
        return (
            result +
            `
            <tr>
                <td>${employee.user}</td>
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.startDate}</td>
                <td>${employee.position}</td>
                <td>${employee.calTotalSalary()}</td>
                <td>${employee.employeeRanking()}</td>
                <td>
                    <button
                        class="btn btn-success" 
                        data-toggle="modal"
                        data-target="#myModal"
                        onclick="selectEmployee('${employee.user}')"
                    >
                        Edit
                    </button>

                    <button
                        class="btn btn-danger my-2"
                        onclick="deleteEmployee('${employee.user}')"
                    >
                        Delete
                    </button>
                </td>
            </tr>
            `
        );
    }, "");

    dom("#tableDanhSach").innerHTML = html;
}

function resetForm() {
    dom("#tknv").value = "";
    dom("#name").value = "";
    dom("#email").value = "";
    dom("#password").value = "";
    dom("#datepicker").value = "";
    dom("#luongCB").value = "";
    dom("#chucvu").value = "";
    dom("#gioLam").value = "";

    dom("#btnThemNV").disabled = false;
}


function validateUser() {
    let user = dom("#tknv").value;
    let spanEl = dom("#tbTKNV");
    if (!user) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Tài khoản không được để trống";
        return false;
    }
    if (user.length < 4 || user.length > 6) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Tài khoản phải từ 4 đến 6 kí tự";
        return false;
    }
    
    spanEl.innerHTML = "";
    return true;
}

function validateName() {
    let name = dom("#name").value;
    let spanEl = dom("#tbTen");
    if (!name) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Tên không được để trống";
        return false;
    }
    
    let regex = /\D/;
    if (!regex.test(name)) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Tên phải là chữ";
        return false;
    }
    
    spanEl.innerHTML = "";
    return true;
}

function validateEmail() {
    let email = dom("#email").value;
    let spanEl = dom("#tbEmail");
    if (!email) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Email không được để trống";
        return false;
    }
    // Kiểm tra định dạng của email
    let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!regex.test(email)) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Email không đúng định dạng";
        return false;
    }
  
    spanEl.innerHTML = "";
    return true;
}

function validatePassword() {
    let password = dom("#password").value;
    let spanEl = dom("#tbMatKhau");
    if (!password) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Mật khẩu không được để trống";
        return false;
    }

    let regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,10}$/;
    if (!regex.test(password)) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Mật khẩu phải từ 6-10 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt)"
        return false;
    }

    spanEl.innerHTML = "";
    return true;
}

function validateStartDate() {
    let startDate = dom("#datepicker").value;
    let spanEl = dom("#tbNgay");
    if (!startDate) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Ngày làm không được để trống";
        return false;
    }
    let regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (!regex.test(startDate)) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Ngày làm không đúng định dạng mm/dd/yyyy"
        return false;
    }

    spanEl.innerHTML = "";
    return true;
}
 
function validateBasicSalary() {
    let basicSalary = dom("#luongCB").value;
    let spanEl = dom("#tbLuongCB");
    if (!basicSalary) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Lương cơ bản không được để trống";
        return false;
    }
    if (basicSalary < 1e6 || basicSalary > 20e6) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Lương cơ bản phải nằm trong khoảng từ" + " " + 1e6 + "đến" + " " + 20e6;
        return false;
    }
    
    spanEl.innerHTML = "";
    return true;
}

function validateWorkingHour() {
    let monthlyWorkingHour = dom("#gioLam").value;
    let spanEl = dom("#tbGiolam");
    if (!monthlyWorkingHour) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Giờ làm không được để trống";
        return false;
    }
    if (monthlyWorkingHour < 80 || monthlyWorkingHour > 200) {
        spanEl.style.display = "inline";
        spanEl.innerHTML = "Giờ làm phải nằm trong khoảng từ 80 đến 200";
        return false;
    }
    
    spanEl.innerHTML = "";
    return true;
}

function validateForm() {
    let isValid = true;
    isValid = validateUser() & validateName() & validateEmail() & validatePassword() & validateStartDate() & validateBasicSalary() & validateWorkingHour();
    // if ((isValid == validateUser()) && (!isValid)) {
    //     alert("Form không hợp lệ");
    //     return false;
    // }

    // if ((isValid == validateName()) && (!isValid)) {
    //     alert("Form không hợp lệ");
    //     return false;
    // }

    // if ((isValid == validatePassword()) && (!isValid)) {
    //     alert("Form không hợp lệ");
    //     return false;
    // }

    // if ((isValid == validateEmail()) && (!isValid)) {
    //     alert("Form không hợp lệ");
    //     return false;
    // }

    // if ((isValid == validateBasicSalary()) && (!isValid)) {
    //     alert("Form không hợp lệ");
    //     return false;
    // }

    // if ((isValid == validateStartDate()) && (!isValid)) {
    //     alert("Form không hợp lệ");
    //     return false;
    // }

    if ((!isValid)) {
        alert("Form không hợp lệ");
        return false;
    }
    
    return true;
}
// ===========================================
function dom(selector) {
    return document.querySelector(selector);
  }
  