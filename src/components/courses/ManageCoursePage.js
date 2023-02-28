import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { loadCourses } from "../../redux/actions/courseActions";
import { loadAuthors } from "../../redux/actions/authorActions";

import CourseForm from "./CourseForm";
import { newCourse } from "../../../tools/mockData";

import PropTypes from "prop-types";

function ManageCoursePage(props) {
    const { courses, authors, loadAuthors, loadCourses } = props
    const [course, setCourse] = useState({ ...props.course });
    const [errors, setErrors] = useState({});

    // Use Effect Hook
    useEffect(() => {
        if (courses.length === 0) {
            loadCourses().catch(error => {
                alert("Loading Courses Failed" + error);
            });
        }

        if (authors.length === 0) {
            loadAuthors().catch(error => {
                alert("Loading Authors Failed" + error);
            });
        }
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setCourse(prevCourse => ({
            ...prevCourse,
            [name]: name === "authorId" ? parseInt(value, 10) : value
        }))
    }

    return <CourseForm course={course} errors={errors} authors={authors} on onChange={handleChange}></CourseForm>

}



ManageCoursePage.propTypes = {
    course: PropTypes.object.isRequired,
    authors: PropTypes.array.isRequired,
    courses: PropTypes.array.isRequired,
    loadCourses: PropTypes.func.isRequired,
    loadAuthors: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        course: newCourse,
        courses: state.courses,
        authors: state.authors
    };
}

const mapDispatchToProps = {
    loadCourses,
    loadAuthors
};


export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
