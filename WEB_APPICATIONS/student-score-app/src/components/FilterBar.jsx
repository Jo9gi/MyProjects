const FilterBar = ({ searchText, onSearchChange, gradeFilter, onGradeChange }) => {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select value={gradeFilter} onChange={(e) => onGradeChange(e.target.value)}>
        <option value="All">All Grades</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="Fail">Fail</option>
      </select>
    </div>
  );
};

export default FilterBar;
