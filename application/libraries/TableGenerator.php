<?php 

defined('BASEPATH') OR exit('No direct script access allowed');



class TableGenerator{

	protected $CI;
	public $instance;
	public $query;
	public $order;
	public $sort;
	public $limit = 50;
	public $offset = 0;
	public $page = 0;
	public $params = array();
	public $header;
	public $return;
	public $vms_db;

	public function __construct(){
		$this->CI =& get_instance(); 
		$this->vms_db = $this->CI->load->database('eproc',true);
	}

	public function initialize($params = array()){

		$this->instance = $this->CI->db;

		foreach($params as $keyParam => $param){
			$this->$keyParam = $param;
		}		

		$this->order();

		$this->return['totalData'] 	= $this->num_rows();

		$this->limit();

		$this->return['data']		= $this->renderData();		

		return $this->return;
	}

	public function initialize_vms($params = array()){

		$this->instance = $this->vms_db;

		foreach($params as $keyParam => $param){
			$this->$keyParam = $param;
		}		

		$this->order();

		$this->return['totalData'] 	= $this->num_rows_vms();

		$this->limit();

		$this->return['data']		= $this->renderDataVms();		

		return $this->return;
	}

	public function generateHeader(){

		$return = array(); 

		$row = 0;

		foreach ($this->header as $key => $value) {
			$return[$row]['key'] = $key;
			$return[$row]['value'] = $value;
			$row++;
		}

		return $return;
	}

	public function num_rows(){
		return $this->instance
						->query($this->query)
						->num_rows();
	}

	public function num_rows_vms(){
		return $this->vms_db
						->query($this->query)
						->num_rows();
	}

	public function renderData(){
		$result = $this->instance->query($this->query)->result_object();		
		return $result;
	}

	public function renderDataVms(){
		$result = $this->vms_db->query($this->query)->result_object();		
		return $result;
	}

	public function order(){

		$_order 		= $this->CI->input->post('order');
		$__order 		= str_replace('|', '.', $_order);
		$_sort			= ($this->CI->input->post('sort')) ? $this->CI->input->post('sort') : 'ASC';

		if($__order != '' || $__order != null){
			$this->query 	= $this->query . ' ORDER BY ' . $__order . ' ' . $_sort;
		}

		$this->return['order'] 	= $this->order	= $_order;
		$this->return['sort']	= $this->sort	= $_sort;
	}

	public function limit(){

		$this->limit 	= $this->CI->input->post('limit');
		if($this->limit!=''){
			$this->return['limit'] = $this->limit;
			$page			= max(0,$this->CI->input->post('page') - 1);

			$this->offset 	= ($page * $this->limit);

			if($this->instance->dbdriver == 'oci8'){

				$this->limit = $this->offset + $this->limit;

				$this->offset+=1;

				$this->query = "SELECT a.*

	  							FROM (	SELECT 	b.*,

	               						rownum b_rownum

	          							FROM (

	           							 	".$this->query."

	           							) b

	         							WHERE rownum <= ".$this->limit."

	         						) a

	 							WHERE b_rownum >= ".$this->offset."";
			}else{

				$this->query 	= $this->query . ' LIMIT '. $this->offset .' , '. $this->limit ;

			}
		}
		// echo $this->query;
	}

	public function filter($query=''){
		$filter = $this->input->post('filter');
	}
}