package com.example.area_android.ui.areas

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.ViewGroup.MarginLayoutParams
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import android.widget.Toast
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProviders
import com.example.area_android.AreaApplication
import com.example.area_android.DisplayAreaActivity
import com.example.area_android.NewAreaActivity
import com.example.area_android.R
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import org.json.JSONObject


class AreasFragment : Fragment() {

    private lateinit var areasViewModel: AreasViewModel
    private var areas: MutableList<JSONObject> = ArrayList()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        areasViewModel =
            ViewModelProviders.of(this).get(AreasViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_areas, container, false)

        val addServiceButton = root.findViewById<Button>(R.id.addServiceButton)

        addServiceButton.setOnClickListener {
            val intent = Intent(this.activity, NewAreaActivity::class.java);
            startActivityForResult(intent, 0)
        }

        this.getAreas(root)
        return root
    }

    private fun getAreas(root: View) {
        val app = this.activity!!.application as AreaApplication

        val areaList = root.findViewById<ListView>(R.id.areas)
        Fuel.get(app.serverUrl + "/me/areas")
            .authentication()
            .bearer(app.token!!)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        Toast.makeText(this.activity, "Request failed", Toast.LENGTH_SHORT).show()
                    }
                    is Result.Success -> {
                        val data = result.get().obj().getJSONArray("data")

                        this.areas.clear()
                        areaList.removeAllViewsInLayout()

                        val areaNames
                                : MutableList<String> = ArrayList()
                        for (i in 0 until data.length()) {
                            val datum = data.getJSONObject(i)
                            areas.add(datum)
                            areaNames.add(datum.getString("name"))
                        }

                        val adapter
                                : ArrayAdapter<String> = ArrayAdapter(
                            this.activity!!,
                            android.R.layout.simple_list_item_1, android.R.id.text1, areaNames
                        )

                        areaList.adapter = adapter

                        areaList.setOnItemClickListener { parent, view, position, id ->
                            val intent = Intent(this.activity, DisplayAreaActivity::class.java)
                            intent.putExtra("area", this.areas[position].toString())
                            startActivityForResult(intent, 0)
                        }
                    }
                }
            }
    }

    @Override
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        println("ONACTIVITYRESULT")
        if (resultCode == Activity.RESULT_OK) {
            this.getAreas(this.activity!!.findViewById(android.R.id.content))
        }
    }
}